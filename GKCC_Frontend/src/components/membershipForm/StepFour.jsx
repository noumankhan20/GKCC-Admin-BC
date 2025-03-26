import React from "react";
import GradientInput from "./GradientInput";

const StepFour = ({
  register,
  errors,
  maritalStatus,
  childrenCount,
}) => {
  // Function to render dynamic child name fields
  const renderChildNameFields = () => {
    const childFields = [];
    for (let i = 0; i < childrenCount; i++) {
      childFields.push(
        <GradientInput
          key={`childName${i}`}
          id={`childName${i}`}
          label={`Child's Name ${i + 1}`}
          register={register}
          required={true}
          pattern={{
            value: /^[A-Za-z\s]+$/,
            message: "Child's Name can only contain letters and spaces",
          }}
          minLength={{
            value: 2,
            message: "Child's Name must be at least 2 characters",
          }}
          errors={errors}
          placeholder={`Enter Child's Name ${i + 1}`}
        />
      );
    }
    return <div className="space-y-4">{childFields}</div>;
  };

  return (
    <div className="space-y-4">
      {/* Father's Name */}
      <GradientInput
        id="fatherName"
        label="Father's Name"
        register={register}
        required={true}
        pattern={{
          value: /^[A-Za-z\s]+$/,
          message: "Father's Name can only contain letters and spaces",
        }}
        minLength={{
          value: 2,
          message: "Father's Name must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Father's Name"
      />

      {/* Mother's Name */}
      <GradientInput
        id="motherName"
        label="Mother's Name"
        register={register}
        required={true}
        pattern={{
          value: /^[A-Za-z\s]+$/,
          message: "Mother's Name can only contain letters and spaces",
        }}
        minLength={{
          value: 2,
          message: "Mother's Name must be at least 2 characters",
        }}
        errors={errors}
        placeholder="Enter Mother's Name"
      />

      {/* Conditionally Render Spouse's Name and Number of Children */}
      {maritalStatus !== "Single" && (
        <>
          {/* Spouse's Name */}
          <GradientInput
            id="spouseName"
            label="Spouse's Name"
            register={register}
            required={true}
            pattern={{
              value: /^[A-Za-z\s]+$/,
              message: "Spouse's Name can only contain letters and spaces",
            }}
            minLength={{
              value: 2,
              message: "Spouse's Name must be at least 2 characters",
            }}
            errors={errors}
            placeholder="Enter Spouse's Name"
          />

          {/* Number of Children */}
          <div>
            <label
              htmlFor="children"
              className="block mb-1 font-medium text-gray-700"
            >
              Number of Children <span className="text-red-500">*</span>
            </label>
            <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
              <input
                id="children"
                type="number"
                {...register("children", {
                  required: "Number of Children is required",
                  min: {
                    value: 0,
                    message: "Number of Children cannot be negative",
                  },
                  max: {
                    value: 20,
                    message: "Maximum number of children can be 20",
                  },
                  validate: {
                    isInteger: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Number of Children must be an integer",
                  },
                })}
                className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
                  errors.children ? "ring-2 ring-red-500" : ""
                }`}
                placeholder="Enter Number of Children"
                min="0"
                max="20"
              />
            </div>
            {errors.children && (
              <p className="text-red-500 text-sm mt-1">
                {errors.children.message}
              </p>
            )}
          </div>

          {/* Dynamic child name fields */}
          {childrenCount > 0 && renderChildNameFields()}
        </>
      )}
    </div>
  );
};

export default StepFour;
