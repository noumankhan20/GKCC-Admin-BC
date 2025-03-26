"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Partners Data
const partnersData = [
  { id: 1, title: "Our Sponsors", description: "Support GKCC and showcase your brand.", link: "/partners#sponsors" },
  { id: 2, title: "Our Vendors", description: "Offer exclusive deals to GKCC members.", link: "/partners#vendors" },
  { id: 3, title: "Our Well-Wishers", description: "Supporters who contribute to our vision.", link: "/partners#wellwishers" },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

// Card Component
const PartnerCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="w-[250px] h-[180px] bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md text-center"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-lg font-bold text-blue-500">{data.title}</h3>
      <p className="text-sm text-gray-700 mt-2">{data.description}</p>
      <Link href={data.link} className="mt-3 text-sm font-medium text-blue-600 inline-flex items-center gap-2">
        <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
          Read More
        </motion.span>
        <FaArrowRight />
      </Link>
    </motion.div>
  );
};

// Main Section Component
const PartnersSection = () => {
  return (
    <section className="w-full py-16 bg-white">
      {/* Header */}
      <motion.div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold text-black">
          Our <span className="text-blue-500 font-bold">Partners</span>
        </h2>
      </motion.div>

      {/* Horizontal Layout */}
      <div className="flex flex-wrap justify-center gap-6 md:flex-row">
        {partnersData.map((item) => (
          <PartnerCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
