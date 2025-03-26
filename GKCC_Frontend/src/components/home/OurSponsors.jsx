"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const sponsorImages = [
  { src: "/framerslider/2.png", alt: "Gold Sponsor A", link: "/vendor-form" },
  {
    src: "/framerslider/3.png",
    alt: "Contact here to become a sponsor",
    link: "/vendor-form",
  },
  { src: "/framerslider/4.png", alt: "Sponsor C", link: "/renderpdf" },
  { src: "/framerslider/5.png", alt: "Sponsor D", link: "/vendor-form" },
];

const OurSponsors = () => {
  return (
    <section className="pt-12 overflow-hidden lg:mt-20 mt-12">
      <div className="container mx-auto px-4 mb-16">
        {/* Heading Section */}
        <div className="mb-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-5xl font-semibold text-black"
          >
            Our <span className="text-blue-500">Sponsors</span>
          </motion.h2>
        </div>

        {/* Sponsor Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sponsorImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative w-full aspect-square overflow-hidden rounded-lg"
            >
              <Link href={image.link}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full cursor-pointer"
                  width={500}
                  height={500}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <div className="w-full flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/partners#our-sponsors">
              <button className="relative inline-block px-6 py-2.5 text-white font-medium text-lg leading-tight rounded-md shadow-inner bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-out overflow-hidden">
                View More
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurSponsors;
