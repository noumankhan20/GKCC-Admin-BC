import React from "react";

const StepIndicator = ({ step, getStepLabel }) => {
  const steps = [1, 2, 3, 4];
  return (
    <div className="mb-6">
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center">
        {steps.map((s, index) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  s <= step
                    ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]"
                    : "bg-white border border-gray-300"
                }`}
              >
                <span className={`font-semibold ${s <= step ? "text-white" : "text-gray-400"}`}>
                  {s}
                </span>
              </div>
              <div className={`mt-2 text-sm ${s <= step ? "text-[#3D87E8]" : "text-gray-400"}`}>
                {getStepLabel(s)}
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${s < step ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center overflow-x-auto">
        {steps.map((s) => (
          <div key={s} className="flex flex-col items-center mx-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                s <= step
                  ? "bg-gradient-to-r from-[#3D87E8] to-[#3ADEC2]"
                  : "bg-white border border-gray-300"
              }`}
            >
              <span className={`font-semibold text-sm ${s <= step ? "text-white" : "text-gray-400"}`}>
                {s}
              </span>
            </div>
            <div className={`mt-1 text-[9px] ${s <= step ? "text-[#3D87E8]" : "text-gray-400"} text-center`}>
              {getStepLabel(s)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
