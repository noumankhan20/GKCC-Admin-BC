import React from "react";
import GradientInput from "./GradientInput";
import { Controller } from "react-hook-form";

const StepThree = ({
  register,
  errors,
  control,
  districtDataMap,
  selectedDistrict,
  setSelectedDistrict,
}) => {
  return (
    <div className="space-y-4">
      {/* Building/Flat/Floor/House */}
      <GradientInput
        id="nativeFlat"
        label="Building/Flat/Floor/House"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "This field must be at least 2 characters",
        }}
        errors={errors}
        placeholder="e.g., Building A, Flat 101, Floor 2"
      />

      {/* Street */}
      <GradientInput
        id="nativeBlock"
        label="Street"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "Street must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Street Name"
      />

      {/* District Dropdown */}
      <div>
        <label
          htmlFor="district"
          className="block mb-1 font-medium text-gray-700"
        >
          District <span className="text-red-500">*</span>
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <select
            id="district"
            {...register("district", {
              required: "District is required",
            })}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
              errors.district ? "ring-2 ring-red-500" : ""
            }`}
          >
            <option value="">Select District</option>
            {Object.keys(districtDataMap).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        {errors.district && (
          <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
        )}
      </div>

      {/* Taluka/City/Town */}
      <GradientInput
        id="nativeCity"
        label="Taluka/City/Town"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "City must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Taluka/City/Town"
      />

      {/* Area/Village */}
      <GradientInput
        id="area"
        label="Area/Village"
        register={register}
        required={true}
        minLength={{
          value: 2,
          message: "Area/Village must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Area/Village"
      />

      {/* Pincode */}
      <GradientInput
        id="nativePincode"
        label="Pincode"
        register={register}
        required={true}
        pattern={{
          value: /^\d{5,10}$/,
          message: "Invalid pincode. It should be 5 to 10 digits.",
        }}
        errors={errors}
        placeholder="Enter Pincode"
      />
    </div>
  );
};

export default StepThree;
