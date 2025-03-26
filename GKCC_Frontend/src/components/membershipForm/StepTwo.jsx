import React from "react";
import GradientInput from "./GradientInput";
import Select from "react-select";
import { Controller } from "react-hook-form";

const StepTwo = ({
  register,
  errors,
  control,
  countryOptions,
  stateOptions,
  cityOptions,
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  setValue,
}) => {
  return (
    <div className="space-y-4">
      {/* Country */}
      <div>
        <label
          htmlFor="internationalCountry"
          className="block mb-1 font-medium text-gray-700"
        >
          Country <span className="text-red-500">*</span>
        </label>
        <Controller
          name="internationalCountry"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <Select
              {...field}
              id="internationalCountry"
              options={countryOptions}
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.label : "");
                setSelectedCountry(selectedOption);
                // Reset State and City when Country changes
                setSelectedState(null);
                setSelectedCity(null);
                setValue("internationalStateProvince", "");
                setValue("internationalCity", "");
              }}
              value={
                selectedCountry
                  ? {
                      value: selectedCountry.value,
                      label: selectedCountry.label,
                    }
                  : null
              }
              placeholder="Select Country"
              isClearable
            />
          )}
        />
        {errors.internationalCountry && (
          <p className="text-red-500 text-sm mt-1">
            {errors.internationalCountry.message}
          </p>
        )}
      </div>

      {/* State/Province */}
      <div>
        <label
          htmlFor="internationalStateProvince"
          className="block mb-1 font-medium text-gray-700"
        >
          State/Province <span className="text-red-500">*</span>
        </label>
        <Controller
          name="internationalStateProvince"
          control={control}
          rules={{ required: "State/Province is required" }}
          render={({ field }) => (
            <Select
              {...field}
              id="internationalStateProvince"
              options={stateOptions}
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.label : "");
                setSelectedState(selectedOption);
                // Reset City when State changes
                setSelectedCity(null);
                setValue("internationalCity", "");
              }}
              value={
                selectedState
                  ? {
                      value: selectedState.value,
                      label: selectedState.label,
                    }
                  : null
              }
              placeholder="Select State/Province"
              isClearable
              isDisabled={!selectedCountry}
            />
          )}
        />
        {errors.internationalStateProvince && (
          <p className="text-red-500 text-sm mt-1">
            {errors.internationalStateProvince.message}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="internationalCity"
          className="block mb-1 font-medium text-gray-700"
        >
          City <span className="text-red-500">*</span>
        </label>
        <Controller
          name="internationalCity"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <Select
              {...field}
              id="internationalCity"
              options={cityOptions}
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.label : "");
                setSelectedCity(selectedOption);
              }}
              value={
                selectedCity
                  ? {
                      value: selectedCity.value,
                      label: selectedCity.label,
                    }
                  : null
              }
              placeholder="Select City"
              isClearable
              isDisabled={!selectedState}
            />
          )}
        />
        {errors.internationalCity && (
          <p className="text-red-500 text-sm mt-1">
            {errors.internationalCity.message}
          </p>
        )}
      </div>

      {/* Building/Flat/Floor/House */}
      <GradientInput
        id="internationalStreetAddress" // If needed, you can rename this to something like "internationalBuildingFlatFloorHouse"
        label="Building/Flat/Floor/House"
        register={register}
        required={true}
        minLength={{
          value: 5,
          message: "Address must be at least 5 characters",
        }}
        errors={errors}
        placeholder="Enter Building/Flat/Floor/House"
      />

      {/* Street */}
      <GradientInput
        id="internationalFlat"
        label="Street"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "Must be at least 2 characters",
        }}
        errors={errors}
        placeholder="e.g., New Link Road"
      />

      {/* Area */}
      <GradientInput
        id="internationalBlock"
        label="Area"
        register={register}
        required={true}
        minLength={{
          value: 1,
          message: "Address must be at least 1 character",
        }}
        errors={errors}
        placeholder="Enter Area No"
      />

      {/* Postal Code */}
<GradientInput
  id="internationalPostalCode"
  label="Postal Code"
  register={register}
  required={true}
  minLength={{
    value: 3,
    message: "Postal code must be at least 3 characters",
  }}
  pattern={{
    value: /^[A-Za-z0-9- ]{3,10}$/,
    message: "Invalid postal code. It should be 3 to 10 alphanumeric characters.",
  }}
  errors={errors}
  placeholder="Enter Postal Code"
/>
</div>
  );
};

export default StepTwo;