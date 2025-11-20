import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface FormData {
  // Step 1 - Service Selection
  serviceTypes: {
    energielabel: boolean;
    wwsPunten: boolean;
    duurzaamheidsadvies: boolean;
  };
  
  // Business Information
  clientType: "private" | "business" | "";
  companyName: string;
  kvkNumber: string;
  
  // Step 2 - Property Details
  address: string;
  houseType: string;
  surfaceArea: string;
  constructionYear: string;
  recentlyRenovated: "ja" | "nee" | "";
  
  // Step 3 - Property Condition
  insulationDetails: string;
  sustainableInstallations: string;
  
  // Energy Label Information (for Sustainability Advice)
  hasEnergyLabel: "ja" | "nee" | "";
  currentEnergyLabel: string;
  wantsNewLabel: "ja" | "nee" | "";
  sustainabilityBudget: string;
  
  // Step 4 - Project Details
  purpose: "verkoop" | "verhuur" | "";
  subsidyRequest: "ja" | "nee" | "";
  deadline: "standaard" | "spoed" | "";
  
  // Step 5 - Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactTime: string;
  additionalDocuments?: FileList;
}

const serviceConfig = {
  energielabel: { label: "Energielabel voor woning" },
  wwsPunten: { label: "WWS puntentelling" },
  duurzaamheidsadvies: { label: "Duurzaamheidsadvies voor woning" },
} as const;

export async function POST(req: Request) {
  try {
    const data: FormData = await req.json();
    console.log("Received form data:", data);

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate environment variables - support multiple naming conventions
    const smtpUser = 
      process.env.SMTP_USER || 
      process.env.BREVO_SMTP_USER || 
      process.env.BREVO_USER ||
      process.env.BREVO_LOGIN ||
      process.env.SMTP_LOGIN;
      
    const smtpPass = 
      process.env.SMTP_PASS || 
      process.env.BREVO_SMTP_PASS || 
      process.env.BREVO_SMTP_KEY || 
      process.env.BREVO_API_KEY ||
      process.env.SMTP_PASSWORD ||
      process.env.BREVO_PASSWORD;
    
    // Debug: Log available environment variables (without exposing values)
    if (!smtpUser || !smtpPass) {
      const availableVars = Object.keys(process.env)
        .filter(key => 
          key.includes('SMTP') || 
          key.includes('BREVO') || 
          key.includes('EMAIL') ||
          key.includes('MAIL')
        )
        .map(key => `${key}=${process.env[key] ? '***' : 'undefined'}`);
      
      console.error("SMTP credentials are missing. Available related env vars:", availableVars);
      console.error("Looking for: SMTP_USER, BREVO_SMTP_USER, BREVO_USER, BREVO_LOGIN, or SMTP_LOGIN");
      console.error("And: SMTP_PASS, BREVO_SMTP_PASS, BREVO_SMTP_KEY, BREVO_API_KEY, SMTP_PASSWORD, or BREVO_PASSWORD");
      
      return NextResponse.json(
        { error: "Email service is not configured. Please check your .env file. Make sure you have SMTP_USER and SMTP_PASS (or BREVO_* variants) set." },
        { status: 500 }
      );
    }
    
    console.log("SMTP credentials found successfully");

    const senderEmail = process.env.SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL;
    const companyEmail = process.env.COMPANY_EMAIL || process.env.BREVO_COMPANY_EMAIL;
    
    if (!senderEmail || !companyEmail) {
      console.error("Email addresses are not configured. Please check your .env file for SENDER_EMAIL and COMPANY_EMAIL");
      return NextResponse.json(
        { error: "Email service is not configured. Please check server configuration." },
        { status: 500 }
      );
    }

    // Format selected services for email
    const formatSelectedServices = (services: FormData['serviceTypes']): string => {
      const selected = Object.entries(services)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => serviceConfig[key as keyof typeof serviceConfig].label);
      
      return selected.length > 0 
        ? selected.join('\n') 
        : 'Geen diensten geselecteerd';
    };

    const selectedServices = formatSelectedServices(data.serviceTypes);

    // Create email transporter with Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // For development, set to true in production with proper certificates
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP server is ready to send emails");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      const errorMessage = verifyError instanceof Error ? verifyError.message : "Unknown error";
      return NextResponse.json(
        { error: `Email service configuration error: ${errorMessage}. Please check your Brevo credentials.` },
        { status: 500 }
      );
    }

    // Email to company
    const mailOptions = {
      from: senderEmail,
      to: companyEmail,
      subject: "Nieuwe offerte aanvraag",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nieuwe offerte aanvraag</h2>
          
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Geselecteerde diensten:</h3>
            <p style="margin-bottom: 0;">${selectedServices}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Type klant:</h3>
            <p>Type: ${data.clientType === 'business' ? 'Zakelijk' : 'Particulier'}</p>
            ${data.clientType === 'business' ? `
              <p>Bedrijfsnaam: ${data.companyName}</p>
              <p>KvK-nummer: ${data.kvkNumber}</p>
            ` : ''}
          </div>

          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Gegevens van de woning:</h3>
            <p>Adres: ${data.address}</p>
            <p>Type woning: ${data.houseType}</p>
            <p>Oppervlakte: ${data.surfaceArea} m²</p>
            <p>Bouwjaar: ${data.constructionYear}</p>
            <p>Recent gerenoveerd: ${data.recentlyRenovated}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Huidige staat van de woning:</h3>
            <p>Isolatie details: ${data.insulationDetails || 'Niet opgegeven'}</p>
            <p>Duurzame installaties: ${data.sustainableInstallations || 'Niet opgegeven'}</p>
            ${data.serviceTypes.duurzaamheidsadvies ? `
              <h4 style="color: #666; margin-top: 15px;">Energielabel informatie:</h4>
              <p>Heeft energielabel: ${data.hasEnergyLabel}</p>
              ${data.hasEnergyLabel === 'ja' ? `<p>Huidig energielabel: ${data.currentEnergyLabel}</p>` : ''}
              <p>Wil nieuw energielabel: ${data.wantsNewLabel}</p>
              <p>Budget voor verduurzaming: ${data.sustainabilityBudget}</p>
            ` : ''}
          </div>

          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Project details:</h3>
            <p>Doel: ${data.purpose}</p>
            <p>Subsidie aanvraag: ${data.subsidyRequest}</p>
            <p>Deadline: ${data.deadline}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Contactgegevens:</h3>
            <p>Naam: ${data.firstName} ${data.lastName}</p>
            <p>Email: ${data.email}</p>
            <p>Telefoon: ${data.phone}</p>
            <p>Voorkeurstijd voor contact: ${data.preferredContactTime || 'Niet opgegeven'}</p>
          </div>
        </div>
      `
    };

    // Send email to company
    try {
      const companyEmailResult = await transporter.sendMail(mailOptions);
      console.log("Company email sent successfully:", companyEmailResult.messageId);
    } catch (emailError) {
      console.error("Error sending email to company:", emailError);
      const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
      return NextResponse.json(
        { error: `Failed to send email: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: senderEmail,
      to: data.email,
      subject: "Bedankt voor uw aanvraag - Het Energielabel Loket",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bedankt voor uw aanvraag</h2>
          
          <p>Beste ${data.firstName},</p>
          
          <p>Bedankt voor uw interesse in onze diensten. We hebben uw aanvraag ontvangen en zullen deze zo spoedig mogelijk behandelen.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">Uw aanvraag betreft:</h3>
            <p>${selectedServices}</p>
          </div>
          
          <p>We nemen binnen ${data.deadline === 'spoed' ? '24' : '24-48'} uur contact met u op om uw aanvraag te bespreken.</p>
          
          <p>Met vriendelijke groet,<br>Team Het Energielabel Loket</p>
        </div>
      `
    };

    // Send auto-reply to customer
    try {
      const autoReplyResult = await transporter.sendMail(autoReplyOptions);
      console.log("Auto-reply email sent successfully:", autoReplyResult.messageId);
    } catch (autoReplyError) {
      console.error("Error sending auto-reply:", autoReplyError);
      // Don't fail the request if auto-reply fails, but log it
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact form submission:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    
    return NextResponse.json(
      { error: "Failed to process your request. Please try again later." },
      { status: 500 }
    );
  }
} 