import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Data for About GKCC
const aboutData = [
  {
    id: 1,
    title: "Our Vision & Mission",
    description:
      "Empowering the Kokan community through unity, entrepreneurship, and education for a prosperous future.",
    link: "/aboutus#vision-mission",
  },
  {
    id: 2,
    title: "Our Core Values",
    description:
      "Driven by trust, teamwork, innovation, quality, integrity, and commitment, we strive to create a lasting impact in the community.",
    link: "/aboutus#core-values",
  },
  {
    id: 3,
    title: "Our Strategies & Action Plan",
    description:
      "Focused on empowering the community, sustainability, and leadership, we strategize for growth, talent utilization, and long-term success.",
    link: "/aboutus#strategies-actions",
  },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

// Static Card Component (with view animation)
const StaticCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-[400px] bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <h3 className="text-2xl md:text-3xl font-bold text-blue-500 text-center">{data.title}</h3>
        <p className="text-base md:text-lg text-gray-600 mt-4 text-center">{data.description}</p>
        <a
          href={data.link}
          className="mt-4 text-base md:text-lg font-medium text-blue-600 inline-flex items-center gap-2"
        >
          <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            Read More
          </motion.span>
          <FaArrowRight />
        </a>
      </div>
    </motion.div>
  );
};

// Main AboutGKCC Component
const AboutGKCC = () => {
  return (
    <section className="w-full h-auto bg-gray-50 px-4 py-12 md:px-12">
      {/* Header */}
      <motion.div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800">
          About{" "}
          <span className="text-blue-500">
            Global Kokani Committees&apos; Council
          </span>
        </h1>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {aboutData.map((item) => (
          <StaticCard key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
};

export default AboutGKCC;
