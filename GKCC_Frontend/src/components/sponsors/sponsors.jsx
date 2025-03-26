"use client";
import React from "react";
import Image from "next/image";

const Sponsors = () => {
  const sponsors = {
    Platinum: [{}, {}, {}, {}],
    Gold: [{}, {}, {}, {}],
    Silver: [
      {
        image: "/sponsers.jpg", // Path relative to the public folder
        title: "ISMAIL EBRAHIM & PARTNER FACTORY CO. FOR STEEL",
      },
      {},
      {},
      {},
    ],
    Bronze: [{}, {}, {}, {}],
  };

  return (
    <div className="mt-12 md:mt-10 bg-white  px-4 md:px-8 lg:px-16">

      <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-blue-500 mb-12">
        Our Sponsors
      </h2>
      <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto mb-8">
        Sponsors play a vital role in supporting the Global Kokani Committees’
        Council (GKCC) by enabling us to drive impactful initiatives and deliver
        essential services to our community. Through your sponsorship, you not
        only contribute to meaningful projects in education, healthcare, and
        community development but also gain the opportunity to showcase your
        brand to a wide and diverse audience. <br/>If your company is interested in
        partnering with us as a sponsor, we invite you to connect with the GKCC
        management team. Together, we can create a tailored sponsorship plan
        that aligns with your business goals and values while contributing to
        the growth and well-being of the Kokani community. To learn more or
        express your interest, please reach out to us at (we could include GKCC
        email address here). Your support can make a lasting difference.
      </p>
      {Object.keys(sponsors).map((category, index) => (
        <div key={index} className="mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-blue-500 mb-8">
            {category} Sponsors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {sponsors[category].map((sponsor, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-lg border-2 border-blue-500 overflow-hidden p-20 md:p-8 flex flex-col items-center justify-center"
              >
                {/* Check if the sponsor has an image and title */}
                {sponsor.image && sponsor.title ? (
                  <>
                    <Image
                      src={sponsor.image}
                      alt={sponsor.title}
                      width={320}
                      height={320}
                      className="w-80 h-80 mb-4 object-contain"
                      priority
                    />
                    <h4 className="text-base sm:text-lg md:text-xl font-medium text-center text-gray-800">
                      {sponsor.title}
                    </h4>
                  </>
                ) : (
                  // Empty card for sponsors without an image and title
                  <div className="w-full h-24 sm:h-32 md:h-40 bg-gray-100 flex items-center justify-center">
                    {/* Optional: Add a placeholder or leave empty */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sponsors;
