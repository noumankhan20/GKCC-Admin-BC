// src/components/membershipForm/GradientInput.jsx
import React from "react";

const GradientInput = ({
  id,
  label,
  register,
  required,
  pattern,
  minLength,
  type = "text",
  placeholder = "",
  errors,
  disabled = false,
  readOnly = false,
  showPassword, // <-- NEW: Toggle for password visibility
  togglePasswordVisibility, // <-- NEW: Function to toggle visibility
}) => (
  <div className="mb-4 relative">
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded relative">
      <input
        id={id}
        type={showPassword ? "text" : type} // <-- NEW: Show/hide password dynamically
        {...(typeof register === "function"
          ? register(id, {
              required: required ? `${label} is required` : false,
              pattern: pattern && {
                value: pattern.value,
                message: pattern.message,
              },
              minLength: minLength && {
                value: minLength.value,
                message: minLength.message,
              },
            })
          : {})}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
          errors && errors[id] ? "ring-2 ring-red-500" : ""
        }`}
        placeholder={placeholder}
      />
      {/* Show/Hide Password Button */}
      {type === "password" && togglePasswordVisibility && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-sm leading-5"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
    {errors && errors[id] && (
      <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>
    )}
  </div>
);

export default GradientInput;
