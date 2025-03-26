"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha"; // reCAPTCHA

// Import your step components
import AssociationDetails from "./AssociationDetails";
import PresidentDetails from "./PresidentDetails";
import SecretaryDetails from "./SecretaryDetails";
import AssociationActivities from "./AssociationActivities";
import StepIndicator from "./StepIndicator";

import countryList from "country-list";
const countryCodesList = require("country-codes-list");

const AssociationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
    control,
  } = useForm({
    mode: "onBlur",
  });

  const router = useRouter();
  const [step, setStep] = useState(1);

  // reCAPTCHA
  const [captchaToken, setCaptchaToken] = useState(""); 
  const recaptchaRef = useRef(null); 

  // States to check if WhatsApp is same as mobile
  const [isSameAsMobilePresident, setIsSameAsMobilePresident] = useState(false);
  const [isSameAsMobileSecretary, setIsSameAsMobileSecretary] = useState(false);

  // File preview for association logo
  const [logoPreview, setLogoPreview] = useState(null);

  // Loading & disable state for the "Submit" button
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Prepare country data
  const countries = countryList.getNames();
  const countryPhoneCodes = Object.values(
    countryCodesList.customList("countryNameEn", "+{countryCallingCode}")
  );

  // Watch certain fields
  const associationLogo = useWatch({ control, name: "associationLogo" });
  const signaturePadRef = useRef({});

  /**
   * ---------------  File Reader for Logo Preview ---------------
   */
  useEffect(() => {
    if (associationLogo && associationLogo.length > 0) {
      const file = associationLogo[0];
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  }, [associationLogo]);

  /**
   * ---------------  Load Data from Local Storage ---------------
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFormData = JSON.parse(localStorage.getItem("associationFormData"));
        const storedStep = parseInt(localStorage.getItem("associationFormStep"), 10);

        if (storedFormData) {
          Object.keys(storedFormData).forEach((field) => {
            // Don't load file fields
            if (field !== "associationLogo" && field !== "presidentSignatureImage") {
              setValue(field, storedFormData[field]);
            }
          });

          // Check if President/Secretary WhatsApp == Mobile
          if (
            storedFormData.presidentMobileCountryCode &&
            storedFormData.presidentMobileNumber &&
            storedFormData.presidentWhatsappCountryCode === storedFormData.presidentMobileCountryCode &&
            storedFormData.presidentWhatsappNumber === storedFormData.presidentMobileNumber
          ) {
            setIsSameAsMobilePresident(true);
          }

          if (
            storedFormData.secretaryMobileCountryCode &&
            storedFormData.secretaryMobileNumber &&
            storedFormData.secretaryWhatsappCountryCode === storedFormData.secretaryMobileCountryCode &&
            storedFormData.secretaryWhatsappNumber === storedFormData.secretaryMobileNumber
          ) {
            setIsSameAsMobileSecretary(true);
          }
        }

        if (storedStep && storedStep >= 1 && storedStep <= 4) {
          setStep(storedStep);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, [setValue]);

  /**
   * ---------------  Persist Data to Local Storage ---------------
   */
  const watchedFields = useWatch({ control });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const dataToStore = { ...watchedFields };
        delete dataToStore.associationLogo;
        delete dataToStore.presidentSignatureImage;
        localStorage.setItem("associationFormData", JSON.stringify(dataToStore));
        localStorage.setItem("associationFormStep", step);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [watchedFields, step]);

  /**
   * ---------------  Handle Final Submission ---------------
   */
  const onSubmit = async (data) => {
    // Make sure the user completed reCAPTCHA:
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsSubmittingForm(true);

    // Combine phone codes and phone numbers
    data.associationContactNumber =
      (data.associationContactCountryCode || "") + (data.associationContactNumber || "");
    delete data.associationContactCountryCode;

    data.presidentMobileNumber =
      (data.presidentMobileCountryCode || "") + (data.presidentMobileNumber || "");
    delete data.presidentMobileCountryCode;

    data.presidentWhatsappNumber =
      (data.presidentWhatsappCountryCode || "") +
      (data.presidenteWhatsappNumber || data.presidentWhatsappNumber || "");
    delete data.presidentWhatsappCountryCode;

    data.secretaryMobileNumber =
      (data.secretaryMobileCountryCode || "") + (data.secretaryMobileNumber || "");
    delete data.secretaryMobileCountryCode;

    data.secretaryWhatsappNumber =
      (data.secretaryWhatsappCountryCode || "") + (data.secretaryWhatsappNumber || "");
    delete data.secretaryWhatsappCountryCode;

    // Prepare FormData
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "associationLogo" && key !== "presidentSignatureImage") {
        formData.append(key, data[key]);
      }
    });

    // President Signature (drawn or uploaded)
    if (data.presidentSignatureImage && data.presidentSignatureImage.length > 0) {
      formData.append("signature", data.presidentSignatureImage[0]);
    } else {
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        const signatureDataUrl = signaturePadRef.current.getTrimmedCanvas().toDataURL("image/png");
        const signatureBlob = await (await fetch(signatureDataUrl)).blob();
        formData.append("signature", signatureBlob, "signature.png");
      } else {
        alert("President's signature is required (draw or upload).");
        setIsSubmittingForm(false);
        return;
      }
    }

    // Association Logo
    if (data.associationLogo && data.associationLogo.length > 0) {
      formData.append("logo", data.associationLogo[0]);
    }

    // reCAPTCHA token
    formData.append("captchaToken", captchaToken); // <-- reCAPTCHA appended here

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/Addassociation`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Form submitted successfully!");
        reset();
        localStorage.removeItem("associationFormData");
        localStorage.removeItem("associationFormStep");

        // Reset reCAPTCHA visually & token
        recaptchaRef.current?.reset();
        setCaptchaToken("");

        // Navigate or do something
        router.push("/associationsubmission");
      } else {
        console.error("Form submission error:", result);
        alert("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }

    setIsSubmittingForm(false);
  };

  /**
   * ---------------  Step Navigation ---------------
   */
  const getFieldsByStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return [
          "associationName",
          "country",
          "locationCity",
          "associationContactCountryCode",
          "associationContactNumber",
          "associationEmail",
          "password",
          "websiteLink",
          "yearEstablished",
          "numberOfMembers",
          "associationLogo",
        ];
      case 2:
        return [
          "presidentName",
          "presidentMobileCountryCode",
          "presidentMobileNumber",
          "presidentWhatsappCountryCode",
          "presidentWhatsappNumber",
          "presidentEmail",
          "presidentDistrict",
          "presidentTaluka",
          "presidentVillage",
        ];
      case 3:
        return [
          "secretaryName",
          "secretaryMobileCountryCode",
          "secretaryMobileNumber",
          "secretaryWhatsappCountryCode",
          "secretaryWhatsappNumber",
          "secretaryDistrict",
          "secretaryTaluka",
          "secretaryVillage",
        ];
      case 4:
        return ["associationActivities", "activityDate"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const isStepValid = await trigger(getFieldsByStep(step));
    if (isStepValid && step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const getStepLabel = (currentStep) => {
    switch (currentStep) {
      case 1:
        return "Association Details";
      case 2:
        return "President Details";
      case 3:
        return "General Secretary Details";
      case 4:
        return "Association Activities";
      default:
        return "";
    }
  };

  /**
   * ---------------  Render ---------------
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3D87E8]">
          Association Membership Registration
        </h2>

        {/* Our Multi-Step Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step Indicator */}
          <StepIndicator step={step} getStepLabel={getStepLabel} />

          {/* Step Components */}
          <div>
            {step === 1 && (
              <AssociationDetails
                register={register}
                errors={errors}
                logoPreview={logoPreview}
                countryPhoneCodes={countryPhoneCodes}
                watch={watch}
              />
            )}
            {step === 2 && (
              <PresidentDetails
                register={register}
                errors={errors}
                countryPhoneCodes={countryPhoneCodes}
                isSameAsMobilePresident={isSameAsMobilePresident}
                setValue={setValue}
                watch={watch}
              />
            )}
            {step === 3 && (
              <SecretaryDetails
                register={register}
                errors={errors}
                countryPhoneCodes={countryPhoneCodes}
                isSameAsMobileSecretary={isSameAsMobileSecretary}
                setValue={setValue}
                watch={watch}
              />
            )}
            {step === 4 && (
              <AssociationActivities
                register={register}
                errors={errors}
                signaturePadRef={signaturePadRef}
              />
            )}
          </div>

          {/* Step Navigation & Submit */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200"
              >
                Previous
              </button>
            )}

            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200"
              >
                Next
              </button>
            )}

            {/* Final Step: Show reCAPTCHA & Submit */}
            {step === 4 && (
              <div className="flex flex-col gap-2 items-end w-full">
                {/* reCAPTCHA widget */}
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  ref={recaptchaRef}
                  onChange={(token) => setCaptchaToken(token)}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200 ${
                    (!captchaToken || isSubmittingForm) ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={!captchaToken || isSubmittingForm}
                >
                  {isSubmittingForm ? (
                    <div className="flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-2 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2054 77.6142 100.591
                            50 100.591C22.3858 100.591 0 78.2054
                            0 50.5908C0 22.9763 22.3858 0.59082
                            50 0.59082C77.6142 0.59082 100 22.9763
                            100 50.5908ZM9.08197 50.5908C9.08197
                            73.3179 27.2729 91.5088 50 91.5088C72.7271
                            91.5088 90.918 73.3179 90.918 50.5908C90.918
                            27.8638 72.7271 9.67285 50 9.67285C27.2729
                            9.67285 9.08197 27.8638 9.08197 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038
                            97.8624 35.9116 96.9786 33.5532C95.2122
                            28.8225 92.871 24.3692 89.9952 20.348
                            C85.5277 14.1192 79.507 9.40046 72.496
                            6.73501C65.485 4.06956 57.8161 3.59279
                            50.9922 5.36448C48.5542 6.01893 47.1197
                            8.52855 47.7568 10.9539C48.3939 13.3793
                            50.8861 14.8487 53.3241 14.1932C58.6338
                            12.729 64.3136 13.1222 69.3926 15.3345C74.4717
                            17.5469 78.7891 21.4771 82.0011 26.4883C84.2356
                            29.718 85.8829 33.3452 86.8436 37.1694C87.5305
                            39.533 90.0003 40.9381 92.4257 40.301C92.6062
                            40.254 92.7871 40.2003 92.9676 40.1401L93.9676
                            39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssociationForm;
