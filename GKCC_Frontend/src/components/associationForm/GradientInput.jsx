import React from "react";

const GradientInput = ({
  id,
  label,
  register,
  required,
  pattern,
  minLength,
  maxLength,
  min,
  max,
  type = "text",
  placeholder,
  errors,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label}
    </label>

    <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
      <input
        id={id}
        type={type}
        {...register(id, {
          required: required ? `${label} is required` : false,
          pattern: pattern && {
            value: pattern.value,
            message: pattern.message,
          },
          minLength: minLength && {
            value: minLength.value,
            message: minLength.message,
          },
          maxLength: maxLength && {
            value: maxLength.value,
            message: maxLength.message,
          },
          min: min && {
            value: min.value,
            message: min.message,
          },
          max: max && {
            value: max.value,
            message: max.message,
          },
        })}
        disabled={disabled}
        className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
          errors[id] ? "ring-2 ring-red-500" : ""
        }`}
        placeholder={placeholder}
      />
    </div>

    {errors[id]?.type === "required" ? (
      <p className="text-red-500 text-sm mt-1">This field is required</p>
    ) : (
      errors[id]?.message && (
        <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
      )
    )}
  </div>
);

export default GradientInput;
