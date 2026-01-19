"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceType {
  id: string;
  label: string;
}

interface ServiceConfig {
  [key: string]: {
    label: string;
    subServices: ServiceType[];
  };
}

interface FormServices {
  isolatie: boolean;
  isolatieType: {
    gevelisolatie: boolean;
    dakisolatie: boolean;
    vloerisolatie: boolean;
  };
  ventilatie: boolean;
  ventilatieType: {
    wtwSystemen: boolean;
    mechanischeVentilatie: boolean;
  };
  energiesystemen: boolean;
  energieType: {
    warmtepompen: boolean;
    hrKetels: boolean;
  };
  glasisolatie: boolean;
  glasType: {
    hrPlusPlus: boolean;
    tripleGlas: boolean;
  };
  [key: string]: boolean | Record<string, boolean>;
}

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

const initialFormData: FormData = {
  serviceTypes: {
    energielabel: false,
    wwsPunten: false,
    duurzaamheidsadvies: false,
  },
  clientType: "",
  companyName: "",
  kvkNumber: "",
  address: "",
  houseType: "",
  surfaceArea: "",
  constructionYear: "",
  recentlyRenovated: "",
  insulationDetails: "",
  sustainableInstallations: "",
  hasEnergyLabel: "",
  currentEnergyLabel: "",
  wantsNewLabel: "",
  sustainabilityBudget: "",
  purpose: "",
  subsidyRequest: "",
  deadline: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContactTime: "",
};

const steps = [
  {
    id: "services",
    title: "Welke diensten mogen wij voor u verzorgen?",
  },
  {
    id: "property",
    title: "Gegevens van de woning",
  },
  {
    id: "condition",
    title: "Huidige staat van de woning",
  },
  {
    id: "project",
    title: "Project details",
  },
  {
    id: "personal",
    title: "Uw contactgegevens",
  },
];

const houseTypes = [
  { id: "hoekwoning", label: "Hoekwoning" },
  { id: "tussenwoning", label: "Tussenwoning" },
  { id: "vrijstaande", label: "Vrijstaande woning" },
  { id: "twee-onder-een-kap", label: "Twee-onder-één-kap woning" },
];

interface FormErrors {
  services?: string;
  clientType?: string;
  companyName?: string;
  kvkNumber?: string;
  address?: string;
  houseType?: string;
  surfaceArea?: string;
  constructionYear?: string;
  recentlyRenovated?: string;
  insulationDetails?: string;
  sustainableInstallations?: string;
  hasEnergyLabel?: string;
  currentEnergyLabel?: string;
  wantsNewLabel?: string;
  sustainabilityBudget?: string;
  purpose?: string;
  subsidyRequest?: string;
  deadline?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredContactTime?: string;
}

// Update service configuration
const serviceConfig = {
  energielabel: { label: "Energielabel voor woning" },
  wwsPunten: { label: "WWS puntentelling" },
  duurzaamheidsadvies: { label: "Duurzaamheidsadvies voor woning" },
} as const;

interface PopUpContactSectionProps {
  isPopup?: boolean;
  onSubmitSuccess?: () => void;
}

export function PopUpContactSection({
  isPopup,
  onSubmitSuccess,
}: PopUpContactSectionProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields - last step is personal info
      if (currentStep === steps.length - 1) {
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone
        ) {
          toast.error("Vul alle verplichte velden in");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || "Er is iets misgegaan. Probeer het later opnieuw.";
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Show success message
      toast.success("Uw aanvraag is succesvol verzonden! We nemen zo spoedig mogelijk contact met u op.");

      // Reset form
      setFormData(initialFormData);
      setCurrentStep(0);

      // Close popup after a short delay to show the success message
      setTimeout(() => {
        onSubmitSuccess?.();
        // Redirect to thank you page
        router.push("/thank-you");
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Er is iets misgegaan. Probeer het later opnieuw.");
      setIsLoading(false);
    }
  };

  const validateStep = () => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 0:
        if (!Object.values(formData.serviceTypes).some((value) => value)) {
          newErrors.services = "Selecteer minimaal één service";
        }
        if (!formData.clientType) {
          newErrors.clientType = "Selecteer type klant";
        }
        if (formData.clientType === "business") {
          if (!formData.companyName) newErrors.companyName = "Bedrijfsnaam is verplicht";
          if (!formData.kvkNumber) newErrors.kvkNumber = "KvK-nummer is verplicht";
        }
        break;
      case 1:
        if (!formData.address.trim()) newErrors.address = "Adres is verplicht";
        if (!formData.houseType.trim()) newErrors.houseType = "Type woning is verplicht";
        if (!formData.surfaceArea.trim()) newErrors.surfaceArea = "Oppervlakte is verplicht";
        if (!formData.constructionYear.trim()) newErrors.constructionYear = "Bouwjaar is verplicht";
        if (!formData.recentlyRenovated) newErrors.recentlyRenovated = "Selecteer of de woning recent gerenoveerd is";
        break;
      case 2:
        // Only validate insulation details if not requesting WWS puntentelling
        if (!formData.serviceTypes.wwsPunten) {
          if (!formData.insulationDetails.trim()) newErrors.insulationDetails = "Beschrijf de huidige isolatie";
          if (!formData.sustainableInstallations.trim()) newErrors.sustainableInstallations = "Beschrijf de duurzame installaties";
        }
        
        // Additional validation for sustainability advice
        if (formData.serviceTypes.duurzaamheidsadvies) {
          if (!formData.hasEnergyLabel) newErrors.hasEnergyLabel = "Geef aan of u een energielabel heeft";
          if (!formData.wantsNewLabel) newErrors.wantsNewLabel = "Geef aan of u een nieuw label wenst";
          if (!formData.sustainabilityBudget.trim()) newErrors.sustainabilityBudget = "Geef uw budget aan";
        }
        break;
      case 3:
        if (!formData.purpose) newErrors.purpose = "Selecteer verkoop of verhuur";
        if (!formData.subsidyRequest) newErrors.subsidyRequest = "Selecteer of er een subsidievraag is";
        if (!formData.deadline) newErrors.deadline = "Selecteer een deadline";
        break;
      case 4:
        if (!formData.firstName.trim()) newErrors.firstName = "Voornaam is verplicht";
        if (!formData.lastName.trim()) newErrors.lastName = "Achternaam is verplicht";
        if (!formData.email.trim()) {
          newErrors.email = "Email is verplicht";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Voer een geldig emailadres in";
        }
        if (!formData.phone.trim()) newErrors.phone = "Telefoonnummer is verplicht";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = validateStep();
    if (!isValid) {
      // Show error message if validation fails
      toast.error("Vul alle verplichte velden in");
      return;
    }

    if (currentStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Client Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Type klant *</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={formData.clientType === "private"}
                    onChange={() => setFormData({ ...formData, clientType: "private" })}
                    className="h-4 w-4 border-gray-300"
                  />
                  <span>Particulier</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={formData.clientType === "business"}
                    onChange={() => setFormData({ ...formData, clientType: "business" })}
                    className="h-4 w-4 border-gray-300"
                  />
                  <span>Zakelijk</span>
                </label>
              </div>
              {errors.clientType && (
                <p className="text-destructive text-sm">{errors.clientType}</p>
              )}
            </div>

            {/* Business Information */}
            {formData.clientType === "business" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Bedrijfsnaam *</label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">KvK-nummer *</label>
                  <Input
                    value={formData.kvkNumber}
                    onChange={(e) => setFormData({ ...formData, kvkNumber: e.target.value })}
                    className={errors.kvkNumber ? "border-red-500" : ""}
                  />
                  {errors.kvkNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.kvkNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Maak hieronder uw keuze uit de beschikbare opties.</h3>
              <div className="grid gap-4">
                {Object.entries(serviceConfig).map(([key, service]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={formData.serviceTypes[key as keyof typeof formData.serviceTypes]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceTypes: {
                            ...formData.serviceTypes,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={key} className="text-sm font-medium">
                      {service.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-sm text-red-500">{errors.services}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Adres van de woning *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type woning *</label>
              <Input
                value={formData.houseType}
                onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}
                className={errors.houseType ? "border-red-500" : ""}
              />
              {errors.houseType && (
                <p className="text-red-500 text-sm mt-1">{errors.houseType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Oppervlakte woning (m²) *</label>
              <Input
                type="number"
                value={formData.surfaceArea}
                onChange={(e) => setFormData({ ...formData, surfaceArea: e.target.value })}
                className={errors.surfaceArea ? "border-red-500" : ""}
              />
              {errors.surfaceArea && (
                <p className="text-red-500 text-sm mt-1">{errors.surfaceArea}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bouwjaar woning *</label>
              <Input
                type="number"
                value={formData.constructionYear}
                onChange={(e) => setFormData({ ...formData, constructionYear: e.target.value })}
                className={errors.constructionYear ? "border-red-500" : ""}
              />
              {errors.constructionYear && (
                <p className="text-red-500 text-sm mt-1">{errors.constructionYear}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recent gerenoveerd? *</label>
              <select
                value={formData.recentlyRenovated}
                onChange={(e) => setFormData({ ...formData, recentlyRenovated: e.target.value as "ja" | "nee" | "" })}
                className={errors.recentlyRenovated ? "border-red-500" : ""}
              >
                <option value="">Selecteer</option>
                <option value="ja">Ja</option>
                <option value="nee">Nee</option>
              </select>
              {errors.recentlyRenovated && (
                <p className="text-red-500 text-sm mt-1">{errors.recentlyRenovated}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Huidige staat van de woning</h3>
            <div className="grid gap-4">
              {/* Only show insulation fields if not requesting WWS puntentelling */}
              {!formData.serviceTypes.wwsPunten && (
                <>
                  <div>
                    <label htmlFor="insulationDetails" className="block text-sm font-medium">
                      Huidige isolatie
                    </label>
                    <Textarea
                      id="insulationDetails"
                      value={formData.insulationDetails}
                      onChange={(e) =>
                        setFormData({ ...formData, insulationDetails: e.target.value })
                      }
                      rows={4}
                    />
                    {errors.insulationDetails && (
                      <p className="mt-1 text-sm text-red-500">{errors.insulationDetails}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sustainableInstallations" className="block text-sm font-medium">
                      Duurzame installaties
                    </label>
                    <Textarea
                      id="sustainableInstallations"
                      value={formData.sustainableInstallations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sustainableInstallations: e.target.value,
                        })
                      }
                      rows={4}
                    />
                    {errors.sustainableInstallations && (
                      <p className="mt-1 text-sm text-red-500">{errors.sustainableInstallations}</p>
                    )}
                  </div>
                </>
              )}

              {/* Additional fields for sustainability advice */}
              {formData.serviceTypes.duurzaamheidsadvies && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Heeft u een geldig energielabel? *</label>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="ja"
                          checked={formData.hasEnergyLabel === "ja"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hasEnergyLabel: e.target.value as "ja" | "nee",
                            })
                          }
                          className="h-4 w-4 border-gray-300"
                        />
                        <span className="ml-2">Ja</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="nee"
                          checked={formData.hasEnergyLabel === "nee"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hasEnergyLabel: e.target.value as "ja" | "nee",
                            })
                          }
                          className="h-4 w-4 border-gray-300"
                        />
                        <span className="ml-2">Nee</span>
                      </label>
                    </div>
                    {errors.hasEnergyLabel && (
                      <p className="mt-1 text-sm text-red-500">{errors.hasEnergyLabel}</p>
                    )}
                  </div>

                  {formData.hasEnergyLabel === "ja" && (
                    <div>
                      <label className="block text-sm font-medium">Welk energielabel heeft u?</label>
                      <Input
                        value={formData.currentEnergyLabel}
                        onChange={(e) =>
                          setFormData({ ...formData, currentEnergyLabel: e.target.value })
                        }
                        placeholder="Bijv. A, B, C, etc."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium">Wilt u een nieuw energielabel? *</label>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="ja"
                          checked={formData.wantsNewLabel === "ja"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              wantsNewLabel: e.target.value as "ja" | "nee",
                            })
                          }
                          className="h-4 w-4 border-gray-300"
                        />
                        <span className="ml-2">Ja</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="nee"
                          checked={formData.wantsNewLabel === "nee"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              wantsNewLabel: e.target.value as "ja" | "nee",
                            })
                          }
                          className="h-4 w-4 border-gray-300"
                        />
                        <span className="ml-2">Nee</span>
                      </label>
                    </div>
                    {errors.wantsNewLabel && (
                      <p className="mt-1 text-sm text-red-500">{errors.wantsNewLabel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Budget voor verduurzaming *</label>
                    <Input
                      type="text"
                      value={formData.sustainabilityBudget}
                      onChange={(e) =>
                        setFormData({ ...formData, sustainabilityBudget: e.target.value })
                      }
                      placeholder="Bijv. €5.000 - €10.000"
                    />
                    {errors.sustainabilityBudget && (
                      <p className="mt-1 text-sm text-red-500">{errors.sustainabilityBudget}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Verkoop of verhuur? *</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value as "verkoop" | "verhuur" | "" })}
                className={errors.purpose ? "border-red-500" : ""}
              >
                <option value="">Selecteer</option>
                <option value="verkoop">Verkoop</option>
                <option value="verhuur">Verhuur</option>
              </select>
              {errors.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subsidievraag? *</label>
              <select
                value={formData.subsidyRequest}
                onChange={(e) => setFormData({ ...formData, subsidyRequest: e.target.value as "ja" | "nee" | "" })}
                className={errors.subsidyRequest ? "border-red-500" : ""}
              >
                <option value="">Selecteer</option>
                <option value="ja">Ja</option>
                <option value="nee">Nee</option>
              </select>
              {errors.subsidyRequest && (
                <p className="text-red-500 text-sm mt-1">{errors.subsidyRequest}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline *</label>
              <select
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value as "standaard" | "spoed" | "" })}
                className={errors.deadline ? "border-red-500" : ""}
              >
                <option value="">Selecteer</option>
                <option value="standaard">Standaard levering (3-5 werkdagen)</option>
                <option value="spoed">Spoedaanvraag (1-2 werkdagen)</option>
              </select>
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Voornaam *</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Achternaam *</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mailadres *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefoonnummer *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Voorkeur voor contactmoment</label>
              <Input
                value={formData.preferredContactTime}
                onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
                placeholder="Bijv. 's ochtends tussen 9-12 uur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Extra documenten (optioneel)</label>
              <Input
                type="file"
                onChange={(e) => setFormData({ ...formData, additionalDocuments: e.target.files || undefined })}
                multiple
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="contact" className="relative bg-background/50 px-4 py-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Left Side - Contact Info */}
          <div className="order-1 md:order-2 w-full max-w-xl mx-auto lg:mx-0">
            <div className="bg-background rounded-xl shadow-lg p-8 border border-border relative">
              {/* Subsidy Badge */}
              {/* <div className="absolute -right-4 top-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-12">
                  <span className="text-sm font-medium">€ Subsidie mogelijk!</span>
                </div> */}

              {/* Main Title */}
              <h2 className="text-xl font-semibold text-center mb-6">
              Vrijblijvende offerte aanvragen
              </h2>

              {/* Step Indicators */}
              <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${
                          index === currentStep
                            ? "bg-primary text-white"
                            : "bg-gray-200"
                        }
                      `}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step Title */}
              <h3 className="text-lg font-medium mb-6">
                {steps[currentStep].title}
              </h3>

              {/* Form Content */}
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}

                <div className="mt-6 space-y-4">
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleBack}
                        disabled={isLoading}
                      >
                        Terug
                      </Button>
                    )}
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Verzenden...
                        </div>
                      ) : currentStep === steps.length - 1 ? (
                        "Aanvraag verzenden"
                      ) : (
                        "Volgende"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
