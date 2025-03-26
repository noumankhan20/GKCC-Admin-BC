"use client";
import React from "react";

const AMemberTable = ({ members, filter, handleView, selectedMember }) => {
  return (
    <table className="min-w-full bg-white text-black">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left">SR</th>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Country</th>
          <th className="px-4 py-2 text-left">Role</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {members.length > 0 ? (
          members.map((member, index) => {
            const isSelected = selectedMember && selectedMember._id === member._id;

            return (
              <tr key={member._id} className="border-b hover:bg-gray-200">
                <td className="px-4 py-2">#{index + 1}</td>
                <td className="px-4 py-2">{member.associationName}</td>
                <td className="px-4 py-2">{member.country}</td>
                <td className="px-4 py-2">{member.president?.name}</td>
                <td className="px-4 py-2">
                  {/* Show button in both pending & allowed. */}
                  {(filter === "pending" || filter === "allowed") && (
                    <button
                      onClick={() => handleView(member)}
                      className={`px-3 py-1 rounded ${
                        isSelected ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
                      }`}
                    >
                      {isSelected ? "Close" : filter === "pending" ? "View" : "Edit"}
                    </button>
                  )}

                  {filter === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-2">
              No members found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AMemberTable;
