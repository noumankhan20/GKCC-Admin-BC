import React from "react";

const GradientSelect = ({
  id,
  label,
  register,
  required,
  errors,
  children,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
      <select
        id={id}
        {...register(id, {
          required: required ? `${label} is required` : false,
        })}
        disabled={disabled}
        className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
          errors[id] ? "ring-2 ring-red-500" : ""
        }`}
      >
        {children}
      </select>
    </div>
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
    )}
  </div>
);

export default GradientSelect;
