"use client";
import React from "react";

const MemberTable = ({ members, filter, onView }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white border-b">
            <th className="px-4 py-2 text-left">SR</th>
            <th className="px-4 py-2 text-left">NAME</th>
            <th className="px-4 py-2 text-left">COUNTRY</th>
            <th className="px-4 py-2 text-left">ROLE</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member, index) => (
              <tr key={member._id} className="border-b text-black">
                <td className="px-4 py-2">#{index + 1}</td>
                <td className="px-4 py-2">
                  {member.firstName} {member.middleName} {member.familyName}
                </td>
                <td className="px-4 py-2">
                  {member.internationalCountry || member.nationality}
                </td>
                <td className="px-4 py-2">{member.role || "N/A"}</td>

                <td className="px-4 py-2">
                  {filter === "pending" && (
                    <button
                      onClick={() => onView(member)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  )}
                  {filter === "allowed" && (
                    <button
                      onClick={() => onView(member)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  {filter === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-black    ">
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
