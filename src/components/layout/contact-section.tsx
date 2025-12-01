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

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (currentStep === 4) {
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

      // Redirect to thank you page after showing success message
      setTimeout(() => {
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

            <h3 className="text-lg font-medium">
              Maak hieronder uw keuze uit de beschikbare opties.
            </h3>
            <div className="grid gap-4">
              {Object.entries(serviceConfig).map(([key, service]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={
                      formData.serviceTypes[
                        key as keyof typeof formData.serviceTypes
                      ]
                    }
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
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Gegevens van de woning</h3>
            <div className="grid gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Adres
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Vul het adres in"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="houseType"
                  className="block text-sm font-medium"
                >
                  Type woning
                </label>
                <select
                  id="houseType"
                  value={formData.houseType}
                  onChange={(e) =>
                    setFormData({ ...formData, houseType: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Selecteer type woning</option>
                  {houseTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.houseType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.houseType}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="surfaceArea"
                  className="block text-sm font-medium"
                >
                  Oppervlakte (m²)
                </label>
                <Input
                  id="surfaceArea"
                  type="number"
                  value={formData.surfaceArea}
                  onChange={(e) =>
                    setFormData({ ...formData, surfaceArea: e.target.value })
                  }
                  placeholder="Vul de oppervlakte in"
                />
                {errors.surfaceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.surfaceArea}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="constructionYear"
                  className="block text-sm font-medium"
                >
                  Bouwjaar
                </label>
                <Input
                  id="constructionYear"
                  type="number"
                  value={formData.constructionYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      constructionYear: e.target.value,
                    })
                  }
                  placeholder="Vul het bouwjaar in"
                />
                {errors.constructionYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.constructionYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Is de woning recent gerenoveerd?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="ja"
                      checked={formData.recentlyRenovated === "ja"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recentlyRenovated: e.target.value as "ja" | "nee",
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
                      checked={formData.recentlyRenovated === "nee"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recentlyRenovated: e.target.value as "ja" | "nee",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Nee</span>
                  </label>
                </div>
                {errors.recentlyRenovated && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.recentlyRenovated}
                  </p>
                )}
              </div>
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
                      placeholder="indien onbekend mag u dit leeg laten"
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
                      placeholder="indien onbekend mag u dit leeg laten. Denk aan warmtepomp, zonnepanelen, etc etc.."
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
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Project details</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium">Doel</label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="verkoop"
                      checked={formData.purpose === "verkoop"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purpose: e.target.value as "verkoop" | "verhuur",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Verkoop</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="verhuur"
                      checked={formData.purpose === "verhuur"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purpose: e.target.value as "verkoop" | "verhuur",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Verhuur</span>
                  </label>
                </div>
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Wilt u een subsidie aanvragen?
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="ja"
                      checked={formData.subsidyRequest === "ja"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subsidyRequest: e.target.value as "ja" | "nee",
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
                      checked={formData.subsidyRequest === "nee"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subsidyRequest: e.target.value as "ja" | "nee",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Nee</span>
                  </label>
                </div>
                {errors.subsidyRequest && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.subsidyRequest}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="standaard"
                      checked={formData.deadline === "standaard"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deadline: e.target.value as "standaard" | "spoed",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Standaard</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="spoed"
                      checked={formData.deadline === "spoed"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deadline: e.target.value as "standaard" | "spoed",
                        })
                      }
                      className="h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2">Spoed</span>
                  </label>
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Uw contactgegevens</h3>
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  Voornaam
                </label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Vul uw voornaam in"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Achternaam
                </label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Vul uw achternaam in"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Vul uw emailadres in"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Telefoonnummer
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Vul uw telefoonnummer in"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="preferredContactTime"
                  className="block text-sm font-medium"
                >
                  Voorkeurstijd voor contact
                </label>
                <Input
                  id="preferredContactTime"
                  value={formData.preferredContactTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactTime: e.target.value,
                    })
                  }
                  placeholder="Bijv. 's ochtends, 's middags, etc."
                />
                {errors.preferredContactTime && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.preferredContactTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="additionalDocuments"
                  className="block text-sm font-medium"
                >
                  Extra documenten (optioneel)
                </label>
                <Input
                  id="additionalDocuments"
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalDocuments: e.target.files || undefined,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-foreground/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Side - Contact Info */}
          <div className="order-1 md:order-2 w-full max-w-xl mx-auto lg:mx-0">
            <div className="bg-background rounded-xl shadow-lg p-8 border border-border relative">
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

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8 lg:sticky lg:top-36 order-2 md:order-1"
          >
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Vraag direct een vrijblijvende offerte aan
              </h2>
            </div>

            {/* Why Contact Ons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Waarom kiezen voor onze diensten?
              </h3>
              <ul className="space-y-3">
                {[
                  "Snel en compliant",
                  "Gepersonaliseerde efficientie",
                  "End-to-end service",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 text-foreground/90"
                  >
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <Link href="tel:+31647198116">
                    <h3 className="font-semibold mb-1">Telefoon</h3>
                    <p className="text-foreground/90">+31647198116</p>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <Link href="mailto:energielabel.loket@gmail.com">
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-foreground/90">energielabel.loket@gmail.com</p>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
