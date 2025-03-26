"use client";
import React, { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NewsLetter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfUrl, setPdfUrl] = useState("/newsletter/NL_1.pdf"); // Path to the static PDF

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden mt-8 flex justify-between items-center bg-blue-500 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">Newsletters</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl focus:outline-none"
        >
          {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute mt-32 md:mt-2 md:static z-10 md:z-auto top-0 left-0 min-h-screen w-3/4 md:w-1/5 bg-blue-500 text-white p-4 transform md:overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <h2 className="flex mt-6 mb-6 items-center justify-center text-2xl md:text-3xl font-bold text-center">
          Newsletters
        </h2>

        {/* Search Bar */}
        <div className="mb-6 flex items-center bg-white rounded-lg p-2">
          <input
            type="text"
            placeholder="Search newsletters..."
            value={searchQuery}
            onChange={handleSearch}
            className="flex-1 p-2 text-blue-500 outline-none rounded-lg"
          />
        </div>

        <ul className="space-y-4">
          {/* Only show the Newsletter if the search matches */}
          {(searchQuery === "" || "Newsletter Vol. 1 Series 1".toLowerCase().includes(searchQuery)) && (
            <li className="cursor-pointer p-3 text-center text-md rounded bg-white text-blue-500 hover:bg-blue-600 hover:text-white">
              Newsletter Vol. 1 Series 1
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 justify-center items-center p-6 bg-white md:overflow-y-auto">
        {/* Display the static PDF */}
        <div className="mt-6">
          <h2 className="text-center text-xl font-semibold mb-4">Newsletter Vol. 1 Series 1</h2>
          <iframe
            src={pdfUrl}
            width="100%"
            height="700"
            title="Newsletter Vol. 1 Series 1"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
