import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MemberAssociationsSection = () => {
  const containerRef = useRef(null);
  const controls = useAnimation();
  const [halfWidth, setHalfWidth] = useState(0);

  const associations = [
    { src: "/asociation/jeddah.png", alt: "Jeddah", name: "JEDDAH" },
    { src: "/asociation/makkah.jpeg", alt: "Makkah", name: "MAKKAH" },
    { src: "/images/damam.jpg", alt: "Dammam", name: "DAMMAM" },
    { src: "/images/khamis.jpg", alt: "Khamis", name: "KHAMIS" },
    { src: "/asociation/jubail.png", alt: "Jubail", name: "JUBAIL" },
    { src: "/asociation/qatar.png", alt: "Qatar", name: "QATAR" },
    { src: "/asociation/uae.png", alt: "UAE", name: "UAE" },
    { src: "/asociation/oman.jpeg", alt: "Oman", name: "OMAN" },
    { src: "/asociation/bahrain.jpeg", alt: "Bahrain", name: "BAHRAIN" },
    { src: "/asociation/kuwait.png", alt: "Kuwait", name: "KUWAIT" },
  ];

  const duplicatedAssociations = [...associations, ...associations];

  useEffect(() => {
    if (containerRef.current) {
      setHalfWidth(containerRef.current.scrollWidth / 2);
    }
  }, []);

  const startMarquee = useCallback(
    async (fromX) => {
      controls.set({ x: fromX });
      await controls.start({
        x: -halfWidth,
        transition: {
          duration: 30,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    },
    [controls, halfWidth]
  );

  useEffect(() => {
    if (halfWidth > 0) {
      startMarquee(0);
    }
  }, [halfWidth, startMarquee]); // ✅ Fix: Added `startMarquee` as a dependency

  return (
    <div className="w-full h-auto mt-10 overflow-hidden">
      <div className="w-full text-center mb-10">
        <h1 className="text-black font-bold text-[8vw] sm:text-[6vw] md:text-[3vw]">
          Our <span className="text-blue-500">Member Associations</span>
        </h1>
      </div>

      <div className="relative w-full py-12 bg-gray-100 flex items-center">
        <button
          className="absolute left-4 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-200 transition"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="overflow-hidden w-full">
          <motion.div
            ref={containerRef}
            animate={controls}
            className="flex flex-nowrap cursor-grab active:cursor-grabbing"
          >
            {duplicatedAssociations.map((item, index) => (
              <div key={index} className="flex-shrink-0 mx-4 flex flex-col items-center">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={250}
                  height={200}
                  className="object-contain"
                />
                <p className="text-center text-gray-800 text-xl mt-2">
                  {item.name}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <button
          className="absolute right-4 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-200 transition"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="w-full flex justify-center mt-16">
        <Link href="/member-association">
          <button className="relative inline-block px-6 py-2.5 text-white font-medium text-lg leading-tight rounded-md shadow-inner bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-out overflow-hidden">
            View More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MemberAssociationsSection;
