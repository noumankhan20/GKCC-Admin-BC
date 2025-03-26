import React, { useEffect, useState } from "react";
import GradientInput from "./GradientInput";
import Select from "react-select";
const countryCodes = require("country-codes-list");

const StepOne = ({
  register,
  errors,
  associations,
  isLoadingAssociations,
  associationError,
  isSameAsMobile,
  setIsSameAsMobile,
  mobileNumber,
  setValue,
  watch,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [showOtherEducation, setShowOtherEducation] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [countryOptions, setCountryOptions] = useState([]); // To store formatted country options for `react-select`

  useEffect(() => {
    try {
      const customCountries = countryCodes.customList(
        "countryCode",
        "[{countryCode}] {countryNameEn}: +{countryCallingCode}"
      );

      const countryArray = Object.keys(customCountries).map((key) => {
        const dialCodeMatch = customCountries[key].match(/\+(\d+)/);
        const dial_code = dialCodeMatch ? customCountries[key].match(/\+(\d+)/)[1] : "";

        return {
          code: key,
          name: customCountries[key],
          dial_code: dial_code,
        };
      });

      // Sort countries alphabetically by name
      const sortedCountries = countryArray.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCountries(sortedCountries);
      // Format countries for react-select
      const formattedCountries = sortedCountries.map((country) => ({
        value: country.dial_code,
        label: `${country.name}`,
      }));

      setCountryOptions(formattedCountries); // Set country options for react-select

    } catch (error) {
      console.error("Error loading countries:", error);
      setCountries([]);
      setCountryOptions([]);
    }
  }, []);

  const selectedEducation = watch("education");
  useEffect(() => {
    if (selectedEducation === "Other") {
      setShowOtherEducation(true);
    } else {
      setShowOtherEducation(false);
      setValue("educationOther", "");
    }
  }, [selectedEducation, setValue]);

  // Watch password value for confirm password validation
  const password = watch("password");
  const handleCountryChange = (selectedOption) => {
    setSelectedCountryCode(selectedOption.value);
    setValue("countryCode", selectedOption.value);  // Store the country code properly in form data
  };


  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="association"
          className="block mb-1 font-medium text-gray-700"
        >
          Select an Association <span className="text-red-500">*</span>
        </label>

        {isLoadingAssociations ? (
          <p className="text-blue-500">Loading associations...</p>
        ) : associationError ? (
          <p className="text-red-500">{associationError}</p>
        ) : (
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <select
              id="association"
              {...register("association", {
                required: "Association selection is required",
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.association ? "ring-2 ring-red-500" : ""
              }`}
              disabled={isLoadingAssociations || associationError}
            >
              <option value="">Select an Association</option>
              {associations.map((assoc) => (
                <option key={assoc.value} value={assoc.value}>
                  {assoc.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {errors.association && (
          <p className="text-red-500 text-sm mt-1">
            {errors.association.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <GradientInput
          id="firstName"
          label="First Name"
          register={register}
          required
          pattern={{
            value: /^[A-Za-z\s]+$/,
            message: "First name can only contain letters and spaces",
          }}
          minLength={{
            value: 2,
            message: "First name must be at least 2 characters",
          }}
          errors={errors}
          placeholder="Enter your first name"
        />

        {/* Middle Name */}
        <GradientInput
          id="middleName"
          label="Middle Name"
          register={register}
          required
          pattern={{
            value: /^[A-Za-z\s]+$/,
            message: "Middle name can only contain letters and spaces",
          }}
          minLength={{
            value: 2,
            message: "Middle name must be at least 2 characters",
          }}
          errors={errors}
          placeholder="Enter your middle name"
        />

        {/* Family Name */}
        <GradientInput
          id="familyName"
          label="Family Name (Surname)"
          register={register}
          required
          pattern={{
            value: /^[A-Za-z\s]+$/,
            message: "Family name can only contain letters and spaces",
          }}
          minLength={{
            value: 2,
            message: "Family name must be at least 2 characters",
          }}
          errors={errors}
          placeholder="Enter your family name"
        />

        {/* Email */}
        <GradientInput
          id="email"
          label="Email"
          register={register}
          required
          pattern={{
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "Invalid email address",
          }}
          errors={errors}
          placeholder="Enter your email"
          type="email"
        />

        {/* Password with Show/Hide Toggle */}
        <div>
      {/* Password Field */}
      <GradientInput
        id="password"
        label="Password"
        register={register}
        required
        pattern={{
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        }}
        errors={errors}
        placeholder="Enter your password"
        type="password"
        showPassword={showPassword}
        togglePasswordVisibility={() => setShowPassword((prev) => !prev)}
      />

      {/* Confirm Password Field */}
      <GradientInput
        id="confirmPassword"
        label="Confirm Password"
        register={register}
        required
        errors={errors}
        placeholder="Confirm your password"
        type="password"
        showPassword={showPassword} // Syncs visibility
        togglePasswordVisibility={() => setShowPassword((prev) => !prev)}
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) => value === password || "Passwords do not match",
        })}
      />
    </div>

        {/* DOB */}
        <div>
          <label htmlFor="dob" className="block mb-1 font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <input
              id="dob"
              type="date"
              {...register("dob", {
                required: "Date of Birth is required",
                validate: {
                  isAdult: (value) => {
                    const today = new Date();
                    const dob = new Date(value);
                    let age = today.getFullYear() - dob.getFullYear();
                    const m = today.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                      age--;
                    }
                    return age >= 21 || "You must be at least 21 years old";
                  },
                },
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.dob ? "ring-2 ring-red-500" : ""
              }`}
            />
          </div>
          {errors.dob && (
            <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
          )}
        </div>

        {/* Blood Group */}
        <div>
          <label
            htmlFor="bloodGroup"
            className="block mb-1 font-medium text-gray-700"
          >
            Blood Group <span className="text-red-500">*</span>
          </label>
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <select
              id="bloodGroup"
              {...register("bloodGroup", {
                required: "Blood Group is required",
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.bloodGroup ? "ring-2 ring-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bloodGroup.message}
            </p>
          )}
        </div>

        {/* Educational Qualification */}
        <div>
          <label
            htmlFor="education"
            className="block mb-1 font-medium text-gray-700"
          >
            Educational Qualification <span className="text-red-500">*</span>
          </label>
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <select
              id="education"
              {...register("education", {
                required: "Educational Qualification is required",
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.education ? "ring-2 ring-red-500" : ""
              }`}
            >
              <option value="">Select Educational Qualification</option>
              <option value="High School">High School</option>
              <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
              <option value="Master's Degree">Master&apos;s Degree</option>
              <option value="Ph.D.">Ph.D.</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">
              {errors.education.message}
            </p>
          )}
        </div>

        {/* Additional Field for "Other" */}
        {showOtherEducation && (
          <GradientInput
            id="educationOther"
            label="Please specify your Educational Qualification"
            register={register}
            required
            pattern={{
              value: /^[A-Za-z\s]+$/,
              message:
                "Educational Qualification can only contain letters and spaces",
            }}
            minLength={{
              value: 2,
              message:
                "Educational Qualification must be at least 2 characters",
            }}
            errors={errors}
            placeholder="Enter your educational qualification"
          />
        )}

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block mb-1 font-medium text-gray-700"
          >
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <select
              id="gender"
              {...register("gender", {
                required: "Gender is required",
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.gender ? "ring-2 ring-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Mobile Number with Country Code */}
        <div>
      {/* Mobile Number Field */}
      <div>
        <label
          htmlFor="mobileNumber"
          className="block mb-1 font-medium text-gray-700"
        >
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          {/* Searchable Country Code Dropdown */}
          <Select
            options={countryOptions} // Using the countryOptions from state
            onChange={handleCountryChange} // Updating the selected country code
            placeholder="Select Country"
            className="shadow-lg"
            classNamePrefix="react-select"
          />
          {errors.countryCode && (
            <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
          )}
        </div>
      </div>

            {/* Mobile Number Input */}
            <GradientInput
              id="mobileNumber"
              label="Mobile Number"
              register={register}
              required
              pattern={{
                value: /^[0-9]{4,15}$/,
                message:
                  "Invalid mobile number. It should contain between 4 to 15 digits.",
              }}
              errors={errors}
              placeholder="Enter your mobile number"
              type="tel"
            />
          </div>

          {/* Checkbox for WhatsApp Number */}
          <div className="flex items-center mt-3">
            <input
              id="sameAsMobile"
              type="checkbox"
              checked={isSameAsMobile}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsSameAsMobile(checked);
                if (checked) {
                  setValue("whatsappNumber", `${selectedCountryCode}${mobileNumber || ""}`);
                } else {
                  setValue("whatsappNumber", "");
                }
              }}
              className="h-4 w-4 text-[#3D87E8] focus:ring-[#3D87E8] border-gray-300 rounded"
            />
            <label
              htmlFor="sameAsMobile"
              className="ml-2 block text-sm text-gray-700"
            >
              WhatsApp number is same as mobile number
            </label>
          </div>

          {/* WhatsApp Number Input */}
          <div className="space-y-2 mt-2">
            <label
              htmlFor="whatsappNumber"
              className="block mb-1 font-medium text-gray-700"
            >
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
              <input
                id="whatsappNumber"
                type="tel"
                {...register("whatsappNumber", {
                  required: "WhatsApp number is required",
                  pattern: {
                    value: /^[0-9]{4,15}$/,
                    message:
                      "Invalid WhatsApp number. It should contain between 4 to 15 digits.",
                  },
                })}
                className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                  errors.whatsappNumber ? "ring-2 ring-red-500" : ""
                }`}
                placeholder="Enter your WhatsApp number"
                disabled={isSameAsMobile}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <label
            htmlFor="maritalStatus"
            className="block mb-1 font-medium text-gray-700"
          >
            Marital Status <span className="text-red-500">*</span>
          </label>
          <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
            <select
              id="maritalStatus"
              {...register("maritalStatus", {
                required: "Marital Status is required",
              })}
              className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                errors.maritalStatus ? "ring-2 ring-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          {errors.maritalStatus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.maritalStatus.message}
            </p>
          )}
        </div>
      </div>
  );
};

export default StepOne;
