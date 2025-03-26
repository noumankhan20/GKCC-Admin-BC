import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";

// reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

// District JSON Files
import raigad from "../../data/districts/raigad.json";
import thane from "../../data/districts/thane.json";
import sindhudurg from "../../data/districts/sindhudurg.json";
import ratnagiri from "../../data/districts/ratnagiri.json";
import palghar from "../../data/districts/palghar.json";
import mumbai from "../../data/districts/mumbai.json";

// Country-State-City
import { Country, State, City } from "country-state-city";

// Import Step Components
import GradientInput from "./GradientInput";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

// Import a simple loader or spinner
import { FaSpinner } from "react-icons/fa"; // Ensure react-icons is installed

const MembershipForm = () => {
  const router = useRouter();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
    control,
    unregister,
  } = useForm({ mode: "onBlur" });

  // Form step state
  const [step, setStep] = useState(1);

  // ---------------- reCAPTCHA States ----------------
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  // Other state variables
  const [isSameAsMobile, setIsSameAsMobile] = useState(false);

  // Watch fields for dynamic form behavior
  const mobileNumber = watch("mobileNumber");
  const maritalStatus = watch("maritalStatus");
  const childrenCount = watch("children");

  // Step 3: Native Address state
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [availableAreas, setAvailableAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  // Step 4: Dynamic child name fields
  const [childNames, setChildNames] = useState([]);

  // Step 2: International Address states
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Associations
  const [associations, setAssociations] = useState([]);
  const [isLoadingAssociations, setIsLoadingAssociations] = useState(false);
  const [associationError, setAssociationError] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const timeoutRef = useRef(null);

  // District data mapping using useMemo
  const districtDataMap = useMemo(
    () => ({
      Raigad: raigad,
      Thane: thane,
      Sindhudurg: sindhudurg,
      Ratnagiri: ratnagiri,
      Palghar: palghar,
      Mumbai: mumbai,
    }),
    []
  );

  // ---------------- Fetch associations ----------------
  useEffect(() => {
    const fetchAssociations = async () => {
      setIsLoadingAssociations(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getAcceptedAssociationNames`
        );
        if (
          response.data &&
          response.data.success &&
          response.data.statusCode === 200
        ) {
          const fetchedAssociations = response.data.data.map((assoc) => ({
            value: assoc.associationName,
            label: assoc.associationName,
          }));
          setAssociations(fetchedAssociations);
          setAssociationError(null);
        } else {
          setAssociationError("Failed to fetch associations.");
        }
      } catch (error) {
        console.error("Error fetching associations:", error);
        setAssociationError("An error occurred while fetching associations.");
      } finally {
        setIsLoadingAssociations(false);
      }
    };
    fetchAssociations();
  }, []);

  // ---------------- Fetch countries ----------------
  useEffect(() => {
    const countries = Country.getAllCountries();
    const formattedCountries = countries.map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountryOptions(formattedCountries);
  }, []);

  // ---------------- Update state options ----------------
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.value);
      const formattedStates = states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(formattedStates);
    } else {
      setStateOptions([]);
      setSelectedState(null);
      setCityOptions([]);
      setSelectedCity(null);
      setValue("internationalStateProvince", "");
      setValue("internationalCity", "");
    }
  }, [selectedCountry, setValue]);

  // ---------------- Update city options ----------------
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(
        selectedCountry.value,
        selectedState.value
      );
      const formattedCities = cities.map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCityOptions(formattedCities);
    } else {
      setCityOptions([]);
      setSelectedCity(null);
      setValue("internationalCity", "");
    }
  }, [selectedCountry, selectedState, setValue]);

  // ---------------- Handle dynamic child name fields ----------------
  useEffect(() => {
    if (maritalStatus !== "Single" && childrenCount > 0) {
      const validChildrenCount = Math.min(childrenCount, 20);
      const newChildNames = Array.from({ length: validChildrenCount }, (_, i) => ({
        name: `childName${i + 1}`,
        label: `Name of Child ${i + 1}`,
      }));

      // Unregister removed fields if user decreased the child count
      if (childNames.length > validChildrenCount) {
        const removedFields = childNames
          .slice(validChildrenCount)
          .map((child) => child.name);
        unregister(removedFields);
      }
      setChildNames(newChildNames);
    } else {
      // Unregister all childName fields if single or no children
      const allChildNames = childNames.map((child) => child.name);
      unregister(allChildNames);
      setChildNames([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenCount, maritalStatus]);

  // ---------------- Retrieve stored form data & step on mount ----------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFormData = JSON.parse(
          localStorage.getItem("membershipFormData")
        );
        const storedStep = parseInt(localStorage.getItem("membershipFormStep"), 10);

        if (storedFormData) {
          Object.keys(storedFormData).forEach((field) => {
            setValue(field, storedFormData[field]);
          });

          if (
            storedFormData.whatsappNumber &&
            storedFormData.whatsappNumber === storedFormData.mobileNumber
          ) {
            setIsSameAsMobile(true);
          }

          // Restore selectedCountry, selectedState, and selectedCity if available
          if (
            storedFormData.internationalCountry &&
            countryOptions.length > 0
          ) {
            const country = countryOptions.find(
              (c) => c.label === storedFormData.internationalCountry
            );
            if (country) setSelectedCountry(country);
          }
          if (
            storedFormData.internationalStateProvince &&
            stateOptions.length > 0
          ) {
            const state = stateOptions.find(
              (s) => s.label === storedFormData.internationalStateProvince
            );
            if (state) setSelectedState(state);
          }
          if (storedFormData.internationalCity && cityOptions.length > 0) {
            const city = cityOptions.find(
              (c) => c.label === storedFormData.internationalCity
            );
            if (city) setSelectedCity(city);
          }

          // Restore district and area selections for Step 3
          if (storedFormData.district) {
            setSelectedDistrict(storedFormData.district);
          }
          if (storedFormData.area) {
            setSelectedArea(storedFormData.area);
          }
        }

        if (storedStep && storedStep >= 1 && storedStep <= 4) {
          setStep(storedStep);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, [
    countryOptions,
    stateOptions,
    cityOptions,
    setValue,
    districtDataMap,
    selectedDistrict,
    availableAreas,
  ]);

  // ---------------- Keep WhatsApp Number in sync ----------------
  useEffect(() => {
    if (isSameAsMobile) {
      setValue("whatsappNumber", mobileNumber || "");
    }
  }, [mobileNumber, isSameAsMobile, setValue]);

  // ---------------- Clear spouse & children if single ----------------
  useEffect(() => {
    if (maritalStatus === "Single") {
      setValue("spouseName", "");
      setValue("children", "");
    }
  }, [maritalStatus, setValue]);

  // ---------------- Watch form fields & store in localStorage ----------------
  const watchedFields = useWatch({ control });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("membershipFormData", JSON.stringify(watchedFields));
        localStorage.setItem("membershipFormStep", step);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [watchedFields, step]);

  // ---------------- Submit handler ----------------
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setIsButtonDisabled(true);

    // 1) Check if reCAPTCHA is completed
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.", {
        autoClose: 3000,
      });
      setIsSubmitting(false);
      setIsButtonDisabled(false);
      return;
    }

    // 2) Re-enable button after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);

    // 3) Send data to the server (including captchaToken)
    const payload = {
      ...data,
      captchaToken, // pass along the reCAPTCHA token
    };

    try {
      console.log("Form Data:", payload);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/member/Submitmemberform`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Form submitted successfully!", {
          autoClose: 3000,
        });
        // Clear local storage
        localStorage.removeItem("membershipFormData");
        localStorage.removeItem("membershipFormStep");

        // Reset reCAPTCHA visually & token
        recaptchaRef.current?.reset();
        setCaptchaToken("");

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error("Form submission failed. Please try again.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Email already exist.", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Clean up the timeout on unmount ----------------
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ---------------- Step Navigation Functions ----------------
  const nextStep = async () => {
    const isStepValid = await trigger(getFieldsByStep(step));
    if (isStepValid && step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Define fields to validate based on the current step
  const getFieldsByStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return [
          "association",
          "country",
          "firstName",
          "middleName",
          "familyName",
          "email",
          "password",
          "dob",
          "bloodGroup",
          "education",
          "mobileNumber",
          "whatsappNumber",
          "gender",
          "maritalStatus",
        ];
      case 2:
        return [
          "internationalCountry",
          "internationalStateProvince",
          "internationalCity",
          "internationalBuildingFlatFloorHouse",
          "internationalFlat",
          "internationalBlock",
          "internationalPostalCode",
        ];
      case 3:
        return [
          "nativeFlat",
          "nativeBlock",
          "district",
          "area",
          "nativePincode",
          "nativeCity",
          "nativeState",
        ];
      case 4:
        const baseFields = ["fatherName", "motherName"];
        const spouseFields =
          maritalStatus !== "Single" ? ["spouseName", "children"] : [];
        const childNameFields = childNames.map((child) => child.name);
        return [...baseFields, ...spouseFields, ...childNameFields];
      default:
        return [];
    }
  };

  // Optional: Step Indicators
  const renderStepIndicator = () => {
    const steps = [1, 2, 3, 4];
    return (
      <div className="mb-6">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-center">
          {steps.map((s, index) => (
            <div key={s} className="flex flex-col items-center flex-1">
              {/* Gradient Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    s <= step
                      ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      s <= step ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {/* Step Label */}
                <div
                  className={`mt-2 text-sm ${
                    s <= step ? "text-[#3D87E8]" : "text-gray-400"
                  }`}
                >
                  {getStepLabel(s)}
                </div>
              </div>
              {/* Connecting Line (Except After Last Step) */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step
                      ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]"
                      : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex justify-between items-center overflow-x-auto">
          {steps.map((s) => (
            <div key={s} className="flex flex-col items-center mx-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step
                    ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]"
                    : "bg-white border border-gray-300"
                }`}
              >
                <span
                  className={`font-semibold text-sm ${
                    s <= step ? "text-white" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              <div
                className={`mt-1 text-xs ${
                  s <= step ? "text-[#3D87E8]" : "text-gray-400"
                } text-center`}
              >
                {getStepLabel(s)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Labels for each step
  const getStepLabel = (currentStep) => {
    switch (currentStep) {
      case 1:
        return "Personal Details";
      case 2:
        return "International Address";
      case 3:
        return "Permanent Address";
      case 4:
        return "Family Details";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-4 text-center text-[#3D87E8]">
          Individual Membership Registration
        </h2>

        {/* Disclaimer Note */}
        <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="text-sm">
            <strong>Disclaimer:</strong> To fill out this form, you must already
            be associated with one of the listed associations. Please ensure you
            are a member before proceeding with the application.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step Indicators */}
          {renderStepIndicator()}

          {/* Step Content */}
          {step === 1 && (
            <StepOne
              register={register}
              errors={errors}
              associations={associations}
              isLoadingAssociations={isLoadingAssociations}
              associationError={associationError}
              isSameAsMobile={isSameAsMobile}
              setIsSameAsMobile={setIsSameAsMobile}
              mobileNumber={mobileNumber}
              setValue={setValue}
              watch={watch}
            />
          )}

          {step === 2 && (
            <StepTwo
              register={register}
              errors={errors}
              control={control}
              countryOptions={countryOptions}
              stateOptions={stateOptions}
              cityOptions={cityOptions}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              setValue={setValue}
            />
          )}

          {step === 3 && (
            <StepThree
              register={register}
              errors={errors}
              control={control}
              districtDataMap={districtDataMap}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              availableAreas={availableAreas}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              setValue={setValue}
            />
          )}

          {step === 4 && (
            <StepFour
              register={register}
              errors={errors}
              maritalStatus={maritalStatus}
              childrenCount={childrenCount}
              childNames={childNames}
            />
          )}

          {/* Navigation & Final Submit */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200"
                disabled={isSubmitting || isButtonDisabled}
              >
                Previous
              </button>
            )}

            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200"
                disabled={isSubmitting || isButtonDisabled}
              >
                Next
              </button>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-2 items-end w-full">
                {/* reCAPTCHA: put it on final step, above the Submit button */}
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  ref={recaptchaRef}
                  onChange={(token) => setCaptchaToken(token)}
                />

                <button
                  type="submit"
                  className={`px-6 py-2 bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] text-white rounded hover:from-[#3ADEC2] hover:to-[#3D87E8] transition duration-200 flex items-center justify-center ${
                    isSubmitting || isButtonDisabled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={!captchaToken || isSubmitting || isButtonDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Submitting...
                    </>
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

export default MembershipForm;
