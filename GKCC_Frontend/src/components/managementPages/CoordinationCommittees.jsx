import React from "react";
import Navbar from "../layouts/navbar/Navbar";
import Image from "next/image";

const CoordinationCommittees = () => {
  const coordinationCouncil = [
    {
      name: "Mr. Dilawar Dalwai",
      association: "Emirates Kokan Committee, UAE",
      image: "/mngmnt/CC/Dilawar.png",
    },
    {
      name: "Mr. Rizwan Sange",
      association: "Oman Kokan Welfare Association (OKWA), Oman",
      image: "/mngmnt/CC/Rizwan.png",
    },
    {
      name: "Mr. Muzammil Parkar",
      association: "Kokan Committee Bahrain, Bahrain",
      image: "/mngmnt/CC/parkar.jpeg",
    },
    {
      name: "Dr. Rahmatullah Galsulker",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/CC/Rahmatullah.png",
    },
    {
      name: "Mufti Hamza Mujawar",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/CC/Hamza_Mujawar.png",
    },
    {
      name: "Mr. Mohamed Shafi Alware",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/CC/shafi.png",
    },
    {
      name: "Mr. Asif Hassan Chougule",
      association: "Relief Foundation Qatar, Qatar",
      // image: "/image7.png",
    },
    {
      name: "Mr. Badruddin Kazi",
      association: "Kokan Committee Khobar-Dammam, Dammam, KSA",
      image: "/mngmnt/CC/Badruddin.png",
    },
    {
      name: "Mr. Muzammil Bharde",
      association: "Kokan Committee Khobar-Dammam, Dammam, KSA",
      image: "/mngmnt/CC/muzzammilll.png",
    },
    {
      name: "Mr. Abdur Rauf Sonde",
      association: "Kokan Committee Jubail, Jubail, KSA",
      // image: "/image10.png",
    },
    {
      name: "Mr. Abdulghani Deshmukh",
      association: "Kokan Committee Jeddah (KCJed), Jeddah, KSA",
      // image: "/image11.png",
    },
    {
      name: "Mr. Rafique Kundlik",
      association: "Kokan Committee Jeddah (KCJed), Jeddah, KSA",
      // image: "/image12.png",
    },
    {
      name: " Mr. Sayed Ahmed Yusuf Kadri",
      association: "Kokan Committee Makkah, Makkah, KSA",
      // image: "/image13.png",
    },
    {
      name: "Mr. Asif Ibji",
      association: "Kokan Committee Khamis-Mushait, Khamis-Mushait, KSA",
      image: "/mngmnt/CC/Usman.jpeg",
    },
  ];

  return (
    <>
      <div className="h-2 block w-full" id="CoordinationCommittees"></div>
      <div className="w-full h-full mt-[5%]">
        <Navbar />
        <div className="w-full h-full pt-5">
          <h1 className="text-center text-[#1A8FE3] font-medium text-3xl sm:text-4xl md:text-5xl mt-10">
            Coordination Council
          </h1>
          <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto">
            A group working closely with the EC to ensure seamless communication
            and coordination between GKCC and its member associations,
            facilitating effective collaboration.
          </p>
          {coordinationCouncil?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 px-10">
              {coordinationCouncil.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 min-h-[400px] flex flex-col items-center"
                >
                  <div className="h-[240px] w-[192px] flex items-center justify-center">
                    <Image
                      src={member.image || "/mngmnt/defaultimage.png"}
                      alt={member.name}
                      width={192}
                      height={240}
                      className="rounded-lg object-cover"
                      priority={index < 3}
                    />
                  </div>
                  <div className="mt-9 text-center">
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-blue-600 mt-2">{member.association}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No coordination council members available.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CoordinationCommittees;
