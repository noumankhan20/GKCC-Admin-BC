import React from "react";
import Image from "next/image"; // Import Image from next/image

const Card = ({ name, title, description, image }) => {
  const displayImage = "/defaultimage.jpg";

  return (
    <div className="w-full max-w-xs flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-64 bg-white">
        <Image
          src={image || displayImage}
          alt={name}
          layout="fill" // Use layout fill to cover the parent div
          objectFit="contain" // Scale the image to fit within the container without cropping
          className="w-full h-full transform scale-90" // Zoom out slightly (adjust scale as needed)
        />
        {/* White border around the image */}
        <div className="absolute inset-0 border-4 border-white" />
      </div>

      {/* Name and Title Section */}
      <div className="p-4 text-center">
        <div className="font-bold text-base">{name}</div>
        <div className="text-sm ">{title}</div>
      </div>

      {/* Description Section */}
      <div className="p-4 text-center">
        <p className=" text-l text-blue-600">{description}</p>
      </div>
    </div>
  );
};

export default Card;
