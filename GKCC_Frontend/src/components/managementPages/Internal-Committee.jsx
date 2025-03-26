import React from "react";
import committeeData from "../../data/committeeData.json"; // Adjust path as needed
import Navbar from "../layouts/navbar/Navbar";

const InternalCommittee = () => {
  return (
    <>
      <div className="h-2 block w-full" id="InternalCommittee"></div>
      <div className="w-full h-full mt-[6%] mb-[60px]">
        <Navbar />
        <div className="w-full h-full pt-5">
          <h1 className="text-center text-[#1A8FE3] font-medium text-3xl sm:text-4xl md:text-5xl mt-20 sm:mt-8 md:mt-5">
            Sub Committees
          </h1>
          <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto">
            Specialized teams focusing on specific areas such as Membership, IT,
            Vendor Management, Raabta, Strategic Projects, and Sharia. These
            committees ensure efficient execution of tasks and drive progress in
            their respective domains, supporting GKCC’s overall mission. Each of
            these groups plays a critical role in the success and growth of
            GKCC, collectively working to unite and empower the Kokani
            community.
          </p>
          <div className="w-full py-3 px-5 mt-10 text-center">
            {committeeData.committees.map((committee, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-3xl md:text-4xl font-semibold text-blue-500 mb-5 mt-5">
                  {committee.category}
                </h2>
                <div className="w-full flex flex-wrap justify-center gap-5 md:gap-10">
                  {committee.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 border rounded-lg shadow-lg bg-white"
                    >
                      <div className="text-center text-xl font-bold text-gray-800">
                        {member.name}
                      </div>
                      <div className="text-center text-lg font-medium text-gray-700">
                        {member.role}
                      </div>
                      <div className="text-center text-sm text-gray-500 mt-2">
                        {committee.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalCommittee;
