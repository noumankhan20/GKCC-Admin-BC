"use client";
import React from "react";

const AMemberFilterTabs = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-between mb-4">
      <button
        className={`px-4 py-2 rounded ${
          filter === "allowed" ? "bg-blue-800 text-white" : "bg-white text-black"
        }`}
        onClick={() => setFilter("allowed")}
      >
        Accepted
      </button>
      <button
        className={`px-4 py-2 rounded ${
          filter === "pending" ? "bg-blue-800 text-white" : "bg-white text-black"
        }`}
        onClick={() => setFilter("pending")}
      >
        Pending
      </button>
      <button
        className={`px-4 py-2 rounded ${
          filter === "rejected" ? "bg-blue-800 text-white" : "bg-white text-black"
        }`}
        onClick={() => setFilter("rejected")}
      >
        Rejected
      </button>
    </div>
  );
};

export default AMemberFilterTabs;
