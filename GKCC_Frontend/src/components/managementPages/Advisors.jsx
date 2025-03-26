import React from "react";
import Navbar from "../layouts/navbar/Navbar";
import Image from "next/image";

const PatronsAdvisors = () => {
  const patronsAdvisors = [
    {
      name: "Mr. Mohammed Saleh Burud",
      title: "Patron",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/advisors/mohammed-saleh.png",
    },
    {
      name: "Mr. Salim Nadker",
      title: "Patron",
      association: "Kokan Committee Bahrain, Bahrain",
      image: "/mngmnt/ExecutiveCouncil/Salim.png",
      // Alternatively: "/mngmnt/advisors/salim-nadker.jpg"
    },
    {
      name: "Mr. Zaid Murghay",
      title: "Advisor",
      association: "Oman Kokan Welfare Association (OKWA), Oman",
      image: "/mngmnt/advisors/zaid-murghay.png",
    },
    {
      name: "Mr. Muazzam Ahmed Naik",
      title: "Advisor",
      association: "Kokan Committee Khobar-Dammam, Dammam, KSA",
      image: "/mngmnt/advisors/moazzam-naik.png",
    },
  ];

  return (
    <>
      <div className="h-2 block w-full" id="PatronsAdvisors"></div>
      <div className="w-full h-full mt-[6%]">
        <Navbar />
        <div className="w-full h-full ">
          <h1 className="text-center text-[#1A8FE3] font-medium text-3xl sm:text-4xl md:text-5xl mt-16 sm:mt-8 md:mt-2">
            Patrons/Advisors
          </h1>
          <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto">
            Respected individuals within the Kokani community with extensive
            experience and expertise who provide guidance, mentorship, and
            strategic advice to GKCC, ensuring the organization stays aligned
            with its vision.
          </p>
          {patronsAdvisors?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 px-10">
              {patronsAdvisors.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 min-h-[400px] flex flex-col items-center"
                >
                  {/* Fixed-size container for the image */}
                  <div className="h-[240px] w-[192px] flex items-center justify-center">
                    <Image
                      src={member.image || "/mngmnt/defaultimage.png"}
                      alt={member.name}
                      width={192}
                      height={240}
                      className="rounded-lg object-cover"
                      priority={index < 3} // Prioritize first few images
                    />
                  </div>

                  {/* Text content in a separate div */}
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    {/* Only render the title if it exists */}
                    {member.title && (
                      <p className="text-gray-600">{member.title}</p>
                    )}
                    <p className="text-blue-500">{member.association}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No patrons or advisors available.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PatronsAdvisors;
