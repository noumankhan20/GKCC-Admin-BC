import React, { useState, useEffect } from "react";
import { Country } from "country-state-city";
import GradientInput from "./GradientInput";
import GradientSelect from "./GradientSelect";

const SecretaryDetails = ({ register, errors, setValue, watch }) => {
  const [isSameAsMobileSecretary, setIsSameAsMobileSecretary] = useState(false);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState([]);

  const watchSecretaryMobileCountryCode = watch("secretaryMobileCountryCode");
  const watchSecretaryMobileNumber = watch("secretaryMobileNumber");

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
    if (isSameAsMobileSecretary) {
      setValue("secretaryWhatsappCountryCode", watchSecretaryMobileCountryCode);
      setValue("secretaryWhatsappNumber", watchSecretaryMobileNumber);
    }
  }, [watchSecretaryMobileCountryCode, watchSecretaryMobileNumber, isSameAsMobileSecretary, setValue]);

  return (
    <div className="space-y-4">
      <GradientInput
        id="secretaryName"
        label="General Secretary Name"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "Name must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter General Secretary's Name"
      />

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Secretary&apos;s Mobile <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <GradientSelect
              id="secretaryMobileCountryCode"
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
              id="secretaryMobileNumber"
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

      {/* Checkbox to copy mobile number to WhatsApp */}
      <div className="flex items-center justify-center my-2">
        <input
          id="sameAsMobileSecretary"
          type="checkbox"
          checked={isSameAsMobileSecretary}
          onChange={(e) => setIsSameAsMobileSecretary(e.target.checked)}
          className="h-4 w-4 text-[#3D87E8] focus:ring-[#3D87E8] border-gray-300 rounded"
        />
        <label
          htmlFor="sameAsMobileSecretary"
          className="ml-2 block text-sm text-gray-700"
        >
          WhatsApp number is same as mobile number
        </label>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Secretary&apos;s WhatsApp <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <GradientSelect
              id="secretaryWhatsappCountryCode"
              label="Country Code"
              register={register}
              required={true}
              errors={errors}
              disabled={isSameAsMobileSecretary}
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
              id="secretaryWhatsappNumber"
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
              disabled={isSameAsMobileSecretary}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Native Address
        </h3>
        <div className="space-y-4">
          <GradientInput
            id="secretaryDistrict"
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
            id="secretaryTaluka"
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
            id="secretaryVillage"
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

export default SecretaryDetails;
