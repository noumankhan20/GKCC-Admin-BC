import React, { useEffect, useState } from "react";
import GradientInput from "./GradientInput";
import GradientSelect from "./GradientSelect";
import { Country } from "country-state-city";

const PresidentDetails = ({ register, errors, setValue, watch }) => {
  const [isSameAsMobilePresident, setIsSameAsMobilePresident] = useState(false);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState([]);

  const watchPresidentMobileCountryCode = watch("presidentMobileCountryCode");
  const watchPresidentMobileNumber = watch("presidentMobileNumber");

  // Fetch country calling codes from country-state-city package
  useEffect(() => {
    const countries = Country.getAllCountries();
    const formattedCountryCodes = countries.map((country) => ({
      value: `+${country.phonecode}`,
      label: `${country.name} (+${country.phonecode})`,
    }));

    setCountryPhoneCodes(formattedCountryCodes);
  }, []);

  // Effect to sync WhatsApp fields when Mobile fields change
  useEffect(() => {
    if (isSameAsMobilePresident) {
      setValue("presidentWhatsappCountryCode", watchPresidentMobileCountryCode);
      setValue("presidentWhatsappNumber", watchPresidentMobileNumber);
    }
  }, [watchPresidentMobileCountryCode, watchPresidentMobileNumber, isSameAsMobilePresident, setValue]);

  return (
    <div className="space-y-4">
      <GradientInput
        id="presidentName"
        label="President Name"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "President Name must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter President's Name"
      />

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          President&apos;s Mobile <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <GradientSelect
              id="presidentMobileCountryCode"
              label="Country Code"
              register={register}
              required={true}
              errors={errors}
            >
              <option value="">Code</option>
              {countryPhoneCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </GradientSelect>
          </div>
          <div className="w-1/2">
            <GradientInput
              id="presidentMobileNumber"
              label="Number"
              register={register}
              required={true}
              pattern={{
                value: /^[0-9]{4,15}$/,
                message:
                  "Invalid mobile number. It should contain 4 to 15 digits.",
              }}
              errors={errors}
              placeholder="123456789"
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Checkbox for Same As Mobile Number */}
      <div className="flex items-center justify-center my-2">
        <input
          id="sameAsMobilePresident"
          type="checkbox"
          checked={isSameAsMobilePresident}
          onChange={(e) => setIsSameAsMobilePresident(e.target.checked)}
          className="h-4 w-4 text-[#3D87E8] focus:ring-[#3D87E8] border-gray-300 rounded"
        />
        <label
          htmlFor="sameAsMobilePresident"
          className="ml-2 block text-sm text-gray-700"
        >
          WhatsApp number is same as mobile number
        </label>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          President&apos;s WhatsApp <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <GradientSelect
              id="presidentWhatsappCountryCode"
              label="Country Code"
              register={register}
              required={true}
              errors={errors}
              disabled={isSameAsMobilePresident}
            >
              <option value="">Code</option>
              {countryPhoneCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </GradientSelect>
          </div>
          <div className="w-1/2">
            <GradientInput
              id="presidentWhatsappNumber"
              label="Number"
              register={register}
              required={true}
              pattern={{
                value: /^[0-9]{4,15}$/,
                message:
                  "Invalid WhatsApp number. It should contain 4 to 15 digits.",
              }}
              errors={errors}
              placeholder="123456789"
              type="tel"
              disabled={isSameAsMobilePresident}
            />
          </div>
        </div>
      </div>

      <GradientInput
        id="presidentEmail"
        label="Email"
        register={register}
        required={true}
        pattern={{
          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          message: "Invalid email address",
        }}
        errors={errors}
        placeholder="Enter Email Address"
        type="email"
      />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Native Address
        </h3>
        <div className="space-y-4">
          <GradientInput
            id="presidentDistrict"
            label="District"
            register={register}
            required={true}
            minLength={{
              value: 2,
              message: "District must be at least 2 characters",
            }}
            errors={errors}
            placeholder="Enter District"
          />
          <GradientInput
            id="presidentTaluka"
            label="Taluka"
            register={register}
            required={true}
            minLength={{
              value: 2,
              message: "Taluka must be at least 2 characters",
            }}
            errors={errors}
            placeholder="Enter Taluka"
          />
          <GradientInput
            id="presidentVillage"
            label="Village"
            register={register}
            required={true}
            minLength={{
              value: 2,
              message: "Village must be at least 2 characters",
            }}
            errors={errors}
            placeholder="Enter Village"
          />
        </div>
      </div>
    </div>
  );
};

export default PresidentDetails;
