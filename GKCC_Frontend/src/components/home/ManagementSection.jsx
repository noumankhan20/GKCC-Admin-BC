"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Data for Management Section
const managementData = [
  { id: 1, title: "Office Bearers", link: "/managements#OfficeBearers" },
  { id: 2, title: "Executive Council", link: "/managements#ExecutiveManagers" },
  { id: 3, title: "Coordination Council", link: "/managements#CoordinationCommittees" },
  { id: 4, title: "Patrons & Advisors", link: "/managements#Advisors" },
  { id: 5, title: "Sub Committees", link: "/managements#InternalCommittee" },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

// Static Card Component (with in-view animation)
const SimpleCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="w-[90%] md:w-[200px] h-[150px] bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-md text-center"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-lg font-bold text-blue-500">{data.title}</h3>
      <Link href={data.link} className="mt-2 text-sm font-medium text-blue-600 inline-flex items-center gap-2">
        <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
          Read More
        </motion.span>
        <FaArrowRight />
      </Link>
    </motion.div>
  );
};

// Main Management Section Component
const ManagementSection = () => {
  return (
    <section className="w-full py-16 bg-white">
      {/* Header */}
      <motion.div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold text-black">
          Global Kokani Committees&apos; Council{" "}
          <span className="text-blue-500 font-bold">Management</span>
        </h2>
      </motion.div>

      {/* Cards Row */}
      <div className="flex flex-wrap justify-center gap-6">
        {managementData.map((item) => (
          <SimpleCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
};

export default ManagementSection;
