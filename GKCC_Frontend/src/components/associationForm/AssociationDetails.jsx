import React, { useEffect, useState } from "react";
import GradientInput from "./GradientInput";
import GradientSelect from "./GradientSelect";
import { Country, State, City } from "country-state-city";
import Image from "next/image";
const countryCodes = require("country-codes-list");
// ✅ Add SearchableCountryCode Component at the Top
const SearchableCountryCode = ({ countries, onSelect, selectedCode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  return (
    <div className="relative bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
      <input
        type="text"
        placeholder="Search country"
        value={searchTerm || selectedCode}  // Display selected code if searchTerm is empty
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg"
      />

      {isOpen && filteredCountries.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearchTerm(`${country.name} (${country.dial_code})`); // Show name and code
                onSelect(country.dial_code);  // Pass only the dial code
                setIsOpen(false);
              }}
            >
              {country.name} ({country.dial_code})
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredCountries.length === 0 && (
        <p className="px-4 py-2 text-gray-500">No matching results</p>
      )}
    </div>
  );
};

const AssociationDetails = ({ register, errors, logoPreview, watch, countryPhoneCodes }) => {
  // For phone country codes (using country-codes-list package)
  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  // For password show/hide toggle
  const [showPassword, setShowPassword] = useState(false);

  // For country dropdown (using country-city-state package)
  const [countryOptions, setCountryOptions] = useState([]);

  // Get country list for country dropdown
  useEffect(() => {
    const countries = Country.getAllCountries();
    const formattedCountries = countries.map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountryOptions(formattedCountries);
  }, []);

  // Get phone country codes for phone fields
  useEffect(() => {
    try {
      const customCountries = countryCodes.customList(
        "countryCode",
        "[{countryCode}] {countryNameEn}: +{countryCallingCode}"
      );

      const countryArray = Object.keys(customCountries).map((key) => {
        const countryData = customCountries[key].split(":"); // Split into name and code
        const countryName = countryData[0].replace(/^\[\w+\]\s*/, "").trim();
        const dialCodeMatch = customCountries[key].match(/\+(\d+)/);
        const dial_code = dialCodeMatch ? `+${dialCodeMatch[1]}` : "";

        return {
          code: key,
          name: countryName, // e.g., "United States: +1"
          dial_code: dial_code, // e.g., "+1"
        };
      });

      // Sort alphabetically by name
      const sortedCountries = countryArray.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCountries(sortedCountries);
    } catch (error) {
      console.error("Error loading countries:", error);
      setCountries([]);
    }
  }, []);

  // Get the current password value using watch (for confirm password validation)
  const passwordValue = watch("password");

  return (
    <div className="space-y-4">
      {/* Association Name */}
      <GradientInput
        id="associationName"
        label={
          <>
            Association Name <span className="text-red-500">*</span>
        </>
        }
        register={register}
        required
        minLength={{
          value: 2,
          message: "Association Name must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Association Name"
      />

      {/* Country (using country-city-state package) */}
      <GradientSelect
        id="country"
        label="Country"
        register={register}
        required
        errors={errors}
      >
        <option value="">Select a country</option>
        {countryOptions.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </GradientSelect>

      {/* Location / City */}
      <GradientInput
        id="locationCity"
        label={
          <>
              Location / City <span className="text-red-500">*</span>
        </>
        }
        register={register}
        required
        minLength={{
          value: 2,
          message: "Location / City must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Location or City"
      />

      {/* Association Contact: Country Code + Number */}
      <div>
  {/* Main Label for the whole contact section */}
  <label className="block mb-1 font-medium text-gray-700">
    Association Contact No <span className="text-red-500">*</span>
  </label>

  {/* Flex container for Country Code and Number side by side */}
  <div className="flex space-x-2">
    {/* Left: Country Code */}
    <div className="w-1/2">
      <label className="block mb-1 font-medium text-gray-700">
        Country Code <span className="text-red-500">*</span>
      </label>
      <SearchableCountryCode
        countries={countries}
        onSelect={(code) => setSelectedCountryCode(code)}
      />
    </div>

    {/* Right: Contact Number */}
    <div className="w-1/2">
      <label className="block mb-1 font-medium text-gray-700">
        Number <span className="text-red-500">*</span>
      </label>
      <GradientInput
        id="associationContactNumber"
        register={register}
        required
        pattern={{
          value: /^[0-9]{4,15}$/,
          message: "Invalid contact number. It should contain 4 to 15 digits.",
        }}
        errors={errors}
        placeholder="123456789" 
        type="tel"
      />
    </div>
  </div>
</div>
      {/* Email */}
      <GradientInput
        id="associationEmail"
        label={
          <>
            Email Address <span className="text-red-500">*</span>
        </>
        }
        register={register}
        required
        pattern={{
          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          message: "Invalid email address",
        }}
        errors={errors}
        placeholder="Enter Email Address"
        type="email"
      />

      {/* Password with Show/Hide option */}
      <div>
        <div className="relative">
          <GradientInput
            id="password"
            label={
              <>
                  Password <span className="text-red-500">*</span>
            </>
            }
            register={register}
            required
            pattern={{
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
              message:
                "Must include uppercase, lowercase, number, and special character",
            }}
            minLength={{
              value: 8,
              message: "Password must be at least 8 characters",
            }}
            errors={errors}
            placeholder="Enter Password"
            // Toggle input type based on showPassword state
            type={showPassword ? "text" : "password"}
            className="pr-12 "
          />
          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-7"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Password must be at least 8 characters and include uppercase,
          lowercase, number, and special character.
        </p>
      </div>

      {/* Confirm Password (for user experience only) */}
      <div>
        <GradientInput
          id="confirmPassword"
          label={
            <>
              Confirm Password <span className="text-red-500">*</span>
          </>
          }
          // Register with a validation rule that compares with the password field.
          register={register}
          required
          errors={errors}
          placeholder="Re-enter Password"
          type={showPassword ? "text" : "password"}
          // Registering with a custom validation using the watched password value.
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
        />

      </div>

      {/* Website Link (Optional) */}
      <div>
        <label
          htmlFor="websiteLink"
          className="block mb-1 font-medium text-gray-700"
        >
          Website Link (Optional)
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <input
            id="websiteLink"
            type="url"
            {...register("websiteLink", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\w\d\-]+\.){1,}[\w]{2,}(\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                message: "Invalid URL",
              },
            })}
            className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
              errors.websiteLink ? "ring-2 ring-red-500" : ""
            }`}
            placeholder="Enter Website Link"
          />
        </div>
        {errors.websiteLink && (
          <p className="text-red-500 text-sm mt-1">
            {errors.websiteLink.message}
          </p>
        )}
      </div>

      {/* Association Logo (Optional) */}
      <div>
        <label
          htmlFor="associationLogo"
          className="block mb-1 font-medium text-gray-700"
        >
          Association Logo (Optional)
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <input
            id="associationLogo"
            type="file"
            accept="image/*"
            {...register("associationLogo")}
            className="w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg"
          />
        </div>
        {logoPreview && (
          <div className="mt-2">
            <Image
              src={logoPreview}
              alt="Association Logo Preview"
              width={96}
              height={96}
              className="object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Year of Established */}
      <GradientInput
        id="yearEstablished"
        label={
          <>
              Year of Established <span className="text-red-500">*</span>
        </>
        }
        register={register}
        required={true}
        pattern={{
          value: /^\d{4}$/,
          message: "Year must be a valid 4-digit number",
        }}
        minLength={{
          value: 4,
          message: "Year must be 4 digits",
        }}
        maxLength={{
          value: 4,
          message: "Year must be 4 digits",
        }}
        min={{
          value: 1800,
          message: "Year must be >= 1800",
        }}
        max={{
          value: new Date().getFullYear(),
          message: "Year cannot be in the future",
        }}
        errors={errors}
        placeholder="e.g., 1990"
        type="number"
      />

      {/* Number of Registered Members */}
      <GradientInput
        id="numberOfMembers"
        label={
          <>
            Number of Registered Members <span className="text-red-500">*</span>
        </>
        }
        register={register}
        required={true}
        pattern={{
          value: /^\d+$/,
          message: "Must be a positive integer",
        }}
        min={{
          value: 1,
          message: "There must be at least one member",
        }}
        max={{
          value: 1000000,
          message: "Number of members seems too large",
        }}
        errors={errors}
        placeholder="Enter Number of Registered Members"
        type="number"
      />
    </div>
  );
};

export default AssociationDetails;
