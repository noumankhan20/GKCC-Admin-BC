import React from "react";

const CoreValues = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">CORE VALUES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:border-blue-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {value.title}
            </h2>
            <p className="text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const values = [
  {
    title: "TRUST",
    description:
      "We will build and maintain strong relationships with all stakeholders to achieve our goals.",
  },
  {
    title: "TEAMWORK",
    description: "We will work together and inspire each other to succeed.",
  },
  {
    title: "INNOVATION",
    description:
      "We will encourage creative thinking and innovative ideas to achieve successful results for stakeholders.",
  },
  {
    title: "QUALITY",
    description:
      "We will excel in every aspect of our execution to meet and exceed community expectations.",
  },
  {
    title: "INTEGRITY",
    description:
      "We commit to transparency, honesty, ethical conduct, and fostering mutual respect within our interactions.",
  },
  {
    title: "COMMITMENT",
    description:
      "We pledge to work selflessly, devoting our time & energy to accomplish given responsibilities.",
  },
];

export default CoreValues;
