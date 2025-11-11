import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface FormData {
  // Step 1 - Service Selection
  serviceTypes: {
    energielabel: boolean;
    nen2580: boolean;
    wwsPunten: boolean;
    duurzaamheidsadvies: boolean;
    isolatieadvies: boolean;
    verkoopklaar: boolean;
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
  nen2580: { label: "NEN 2580 meetrapport" },
  wwsPunten: { label: "WWS puntentelling" },
  duurzaamheidsadvies: { label: "Duurzaamheidsadvies voor woning" },
  isolatieadvies: { label: "Isolatieadvies" },
  verkoopklaar: { label: "Verkoopklaar maken woning" },
} as const;

export async function POST(req: Request) {
  try {
    const data: FormData = await req.json();
    console.log(data);

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Format selected services for email
    const formatSelectedServices = (services: FormData['serviceTypes']): string => {
      return Object.entries(services)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => serviceConfig[key as keyof typeof serviceConfig].label)
        .join('\n');
    };

    const selectedServices = formatSelectedServices(data.serviceTypes);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to company
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.COMPANY_EMAIL,
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

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: process.env.SENDER_EMAIL,
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

    // Send auto-reply
    await transporter.sendMail(autoReplyOptions);

    console.log("Email sent successfully", mailOptions, autoReplyOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
} 