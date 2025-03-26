import React from "react";
import Image from "next/image";
import Navbar from "../layouts/navbar/Navbar";

const ExecutiveManagers = () => {
  const executiveManagers = [
    {
      name: "Mr. Shakil Sahibole",
      association: "Emirates Kokan Committee, UAE",
      // image: "/mngmnt/ExecutiveCouncil/damman.jpg",
    },
    {
      name: "Mr. Nabeel Mullaji",
      association: "Kokan Committee Bahrain, Bahrain",
      image: "/mngmnt/ExecutiveCouncil/Nabeel.jpeg",
    },
    {
      name: "Mr. Aslam Thakur",
      association: "Kokan Welfare Society, Kuwait",
      image: "/mngmnt/ExecutiveCouncil/Aslam.png",
    },
    {
      name: "Mr. Asgar Sarguroh",
      association: "Kokan Committee Khobar-Dammam, Dammam, KSA",
      image: "/mngmnt/ExecutiveCouncil/Asgar_Sarguroh.png",
    },
    {
      name: "Mr. Salim Talib",
      association: "Kokan Committee Jubail, Jubail, KSA",
      image: "/mngmnt/defaultimage.png", // Placeholder as image was commented out
    },
  ];

  return (
    <>
      <div className="h-2 block w-full" id="ExecutiveManagers"></div>
      <div className="w-full h-full">
        <Navbar />
        <div className="w-full h-full pt-5">
          <h1 className="text-center text-[#1A8FE3] font-medium text-3xl sm:text-4xl md:text-5xl mt-20 sm:mt-8 md:mt-5">
            Executive Council
          </h1>
          <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto">
            Representatives from member associations who play a pivotal role in
            shaping policies, overseeing operations, and supporting the
            implementation of GKCC&apos;s initiatives.
          </p>
          {executiveManagers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 px-10">
              {executiveManagers.map((manager, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 min-h-[400px] flex flex-col items-center"
                >
                  <div className="h-[240px] w-[192px] flex items-center justify-center">
                    <Image
                      src={manager.image || "/mngmnt/defaultimage.png"}
                      alt={manager.name}
                      width={192}
                      height={240}
                      className="rounded-lg object-cover"
                      priority={index < 3}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{manager.name}</h2>
                    <p className="text-gray-600">{manager.association}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No executive managers available.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ExecutiveManagers;
