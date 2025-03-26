"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const sliderImages = [
  { src: "/heroslider/1.webp", alt: "Jeddah" },
  { src: "/heroslider/2.webp", alt: "Makkah" },
  { src: "/heroslider/3.webp", alt: "Dammam" },
  { src: "/heroslider/4.webp", alt: "Khamis" },
];

const SideSponsorImage = [
  {
    src: "/framerslider/empty2.png",
    alt: "Gold Sponsor A",
    link: "/vendor-form",
  },
  {
    src: "/framerslider/empty2.png",
    alt: "Become a Sponsor",
    link: "/vendor-form",
  },
  { src: "/framerslider/empty2.png", alt: "Sponsor C", link: "/vendor-form" },
  { src: "/framerslider/empty2.png", alt: "Sponsor D", link: "/vendor-form" },
];

const HeroBanner = () => {
  return (
    <div className="flex flex-wrap lg:flex-nowrap w-full  ">
      {/* Hero Section */}
      <div className="hero-slider flex-grow lg:basis-[85%] basis-full min-w-0 h-[50vh] lg:h-[90vh] flex items-center justify-center relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="relative w-full h-full"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Link href="/media#newsletter">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-full cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    fill
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-grey opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-end mt-48 flex-col text-center text-blue-800 z-10">
                    <h1 className="text-4xl md:text-4xl font-bold uppercase bg-gradient-to-r from-white to-blue-500 text-black p-4 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                      AGM-2024
                    </h1>
                    <p className="text-xl text-bold w-full bg-blue-800 sm:text-3xl md:text-2xl lg:text-1.5xl xl:text-1.2xl text-white font-medium capitalize mt-4">
                      We serve better -- together
                    </p>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Static Sponsor Section */}
{/* Static Sponsor Section */}
<div className="static-sponsor hidden lg:flex flex-shrink-0 lg:basis-[15%] basis-full flex-col justify-center items-center p-3 gap-4 lg:h-[90vh] md:items-center md:gap-0">
  {SideSponsorImage.map((image, index) => (
    <Link
      key={index}
      href={image.link}
      className="bg-white rounded-lg text-center w-[90%] lg:w-full h-[100px] lg:h-[200px] md:h-[150px] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.5 }}
        className="w-full h-full flex items-center justify-center"
      >
        <Image
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-contain"
          width={140}
          height={100}
        />
      </motion.div>
    </Link>
  ))}
</div>

    </div>
  );
};

export default HeroBanner;
