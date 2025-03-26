"use client";
import React from "react";
import Image from "next/image";

const WellWishers = () => {
  const wellWishers = [
    // Example WellWishers (add image and title if available)
    // {
    //   image: "/images/wellwisher1.png",
    //   title: "WellWisher One",
    // },
    {}, {}, {}, {},
  ];

  return (
    <div className=" bg-white min-h-3 py-8 px-4 md:px-8 lg:px-16">
      <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-blue-500 mb-12">
        Our Well Wishers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {wellWishers.map((wellWisher, i) => (
          <div
            key={i}
            className="bg-white shadow-lg rounded-lg border-2 border-blue-500 overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300"
          >
            {/* Check if the WellWisher has an image and title */}
            {wellWisher.image && wellWisher.title ? (
              <>
                <Image
                  src={wellWisher.image}
                  alt={wellWisher.title}
                  width={160}
                  height={160}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain mb-4"
                  priority
                />
                <h4 className="text-base sm:text-lg md:text-xl font-medium text-center text-gray-800">
                  {wellWisher.title}
                </h4>
              </>
            ) : (
              // Placeholder for WellWishers without image and title
              <div className="w-full h-24 sm:h-32 md:h-40 bg-gray-100 flex items-center justify-center">
                {/* Empty space for missing well-wisher data */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellWishers;
