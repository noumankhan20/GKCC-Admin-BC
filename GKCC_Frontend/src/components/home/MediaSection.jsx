"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const mediaCards = [
  {
    id: 1,
    title: "Newsletter",
    description: "Stay updated with the latest news and updates.",
    image: "/media/2-rm.png",
    link: "/media#newsletter", // Update with your actual path
  },
  {
    id: 2,
    title: "Event Video",
    description: "Watch highlights and moments from our recent events.",
    image: "/media/3.jpg",
    link: "/media#eventvideo", // Update with your actual path
  },
  {
    id: 3,
    title: "Picture Gallery",
    description: "Explore memories captured in our picture gallery.",
    image: "/media/1.jpg",
    link: "/media#eventphoto", // Update with your actual path
  },
];

const MediaSection = () => {
  return (
    <section className="w-full py-20 bg-white">
      {/* Section Title */}
      <h2 className="text-2xl text-center md:text-5xl font-semibold text-blue-500">
        Media
      </h2>

      {/* Media Cards */}
      <div className="container mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {mediaCards.map((card) => (
          <div
            key={card.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-full h-48">
              <Image
                src={card.image}
                alt={card.title}
                className="w-full h-full  object-contain"
                width={500}
                height={300}
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
              <p className="text-gray-600 mt-3">{card.description}</p>
              <Link href={card.link}>
                <button className="mt-5 inline-block px-6 py-2.5 text-white font-medium text-sm leading-tight rounded-md shadow-inner bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-out overflow-hidden">
                  View More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaSection;
