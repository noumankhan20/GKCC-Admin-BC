import React from "react";
import Image from "next/image";
import Navbar from "../layouts/navbar/Navbar";

const OfficeBearers = () => {
  const officeBearers = [
    {
      name: "Mr. Sattar Surve",
      position: "President",
      association: "Relief Foundation Qatar, Qatar",
      image: "/mngmnt/officeBearer/sattarsurve.png",
    },
    {
      name: "Mr. Labib Fakih",
      position: "Senior Vice President",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/officeBearer/labib-fakih.jpeg",
    },
    {
      name: "Mr. Mushtaq Desai",
      position: "Vice President",
      association: "Kokan Committee Khobar-Dammam, Dammam, KSA",
      image: "/mngmnt/officeBearer/mushtaq-desai.jpeg",
    },
    {
      name: "Mr. Ismail Wangde",
      position: "General Secretary",
      association: "Kokan Committee Jeddah, Jeddah, KSA",
      image: "/mngmnt/officeBearer/ismail-wangde.png",
    },
    {
      name: "Mr. Parvez Wadekar",
      position: "Joint General Secretary",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/officeBearer/parvez-wadekar.png",
    },
    {
      name: "Mr. Emtiyaz Pasware",
      position: "Assistant General Secretary",
      association: "Kokan Committee Makkah, Makkah, KSA",
      image: "/mngmnt/officeBearer/emtiyaz-pasware.png",
    },
    {
      name: "Mr. Tahir Khanzadah",
      position: "Treasurer",
      association: "Oman Kokan Welfare Association (OKWA), Oman",
      image: "/mngmnt/officeBearer/Tahir.jpeg",
    },
    {
      name: "Mr. Faiz Rakhange",
      position: "Joint Treasurer",
      association: "Kokan Committee Jeddah, Jeddah, KSA",
      image: "/mngmnt/officeBearer/faiz-rakhange.jpeg",
    },
    {
      name: "Mr. Waqar Pallawkar",
      position: "Assistant Joint Treasurer",
      association: "Kokan Committee Khamis-Mushait, Khamis-Mushait, KSA",
      image: "/mngmnt/officeBearer/waqar-pallawkar.png",
    },
  ];
  return (
    <>
      <div className="h-2 block w-full" id="OfficeBearers"></div>
      <div className="w-full h-full">
        <Navbar />
        <div className="w-full h-full pt-5">
          <h1 className="text-center text-[#1A8FE3] font-medium text-3xl sm:text-4xl md:text-5xl mt-20 sm:mt-8 md:mt-5">
            Office Bearers
          </h1>
          <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto">
          The core leadership team responsible for steering the organization.
          This includes the President, Vice Presidents, General Secretary,
          Treasurer, and other key roles tasked with decision-making,
          strategic planning, and representing GKCC globally.
        </p>
  
          {officeBearers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 px-10">
              {officeBearers.map((bearer, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 min-h-[400px] flex flex-col items-center"
                >
                  <div className="h-[240px] w-[192px] flex items-center justify-center">
                    <Image
                      src={bearer.image || "/mngmnt/defaultimage.png"}
                      alt={bearer.name}
                      width={192}
                      height={240}
                      className="rounded-lg object-cover"
                      priority={index < 3}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{bearer.name}</h2>
                    <p className="text-gray-600">{bearer.position}</p>
                    <p className="text-blue-500">{bearer.association}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No office bearers available.
            </p>
          )}
        </div>
      </div>
    </>
  );
  
};

export default OfficeBearers;
