import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import GradientSelect from "./GradientSelect";

const AssociationActivities = ({ register, errors, signaturePadRef }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="associationActivities" className="block mb-1 font-medium text-gray-700">
          Provide Information about Association Activities <span className="text-red-500">*</span>
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <textarea
            id="associationActivities"
            {...register("associationActivities", {
              required: "Activities information is required",
              minLength: {
                value: 10,
                message: "Please provide more details",
              },
            })}
            className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
              errors.associationActivities ? "ring-2 ring-red-500" : ""
            }`}
            placeholder="Describe the activities..."
            rows="4"
          ></textarea>
        </div>
        {errors.associationActivities && (
          <p className="text-red-500 text-sm mt-1">
            {errors.associationActivities.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="activityDate" className="block mb-1 font-medium text-gray-700">
          Date <span className="text-red-500">*</span>
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <input
            id="activityDate"
            type="date"
            {...register("activityDate", { required: "Date is required" })}
            className={`w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg ${
              errors.activityDate ? "ring-2 ring-red-500" : ""
            }`}
          />
        </div>
        {errors.activityDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.activityDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          President Signature (Draw)
        </label>
        <div className="border rounded">
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "border rounded",
            }}
            ref={signaturePadRef}
          />
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => signaturePadRef.current.clear()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Clear Signature
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="presidentSignatureImage" className="block mb-1 font-medium text-gray-700">
          President Signature (Upload Image) - Optional
        </label>
        <div className="bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2] p-[1px] rounded">
          <input
            id="presidentSignatureImage"
            type="file"
            accept="image/*"
            {...register("presidentSignatureImage")}
            className="w-full bg-white border-none rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D87E8] shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AssociationActivities;
