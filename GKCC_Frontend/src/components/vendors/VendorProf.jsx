"use client";
import React, { useState } from "react";
import Navbar from "../layouts/navbar/Navbar";

const VendorProf = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-4 sm:px-6   xl:px-16">
        <h1 className="text-blue-500 text-3xl sm:text-4xl md:text-5xl font-bold text-center ">
          OUR VENDORS
        </h1>
        <p className="text-center text-black text-base sm:text-lg md:text-xl mt-10 max-w-3xl mx-auto mb-8">
          Vendors have a unique opportunity to connect with the Global Kokani
          Committees’ Council’s (GKCC) extensive network of registered
          individual members. By offering exclusive discounts and special deals
          on your products or services to GKCC members, you not only support the
          community but also expand your reach and grow your business.<br/> As a
          vendor, you’ll gain visibility through our growing database and enjoy
          the chance to showcase your business to a large and engaged audience.
          If you’re interested in partnering with GKCC as a vendor, please
          contact us at [we could include GKCC email address/contact details/or
          link to contact us page here]. Let’s work together to create value for
          the Kokani community while driving growth for your business!
        </p>
        {/* Filters and Sort Section */}
        <div className="w-full bg-[#1A8FE3] rounded-3xl flex flex-col gap-4 items-center p-4 mb-10 shadow-lg lg:flex-row lg:justify-between xl:px-16">
          <div className="flex flex-col md:flex-row items-center w-full lg:gap-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-2 bg-white text-gray-500 rounded-2xl"
            >
              Filters
              <span className="ml-2">{showFilters ? "▲" : "▼"}</span>
            </button>
            <button
              onClick={() =>
                setSortBy(sortBy === "rating" ? "discount" : "rating")
              }
              className="flex items-center px-6 py-2 bg-white text-gray-500 rounded-2xl mt-4 md:mt-0 md:ml-4"
            >
              Sort by {sortBy === "rating" ? "Discount" : "Rating"}
            </button>
          </div>

          <div className="relative w-full md:w-96 lg:w-[400px] xl:w-[500px]">
            <input
              type="text"
              placeholder="Search Vendors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white text-black w-full"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white text-blue-500">
              Search
            </button>
          </div>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <div className="w-full mt-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex items-center">
                <select
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-blue-500 focus:outline-none w-full"
                >
                  <option value="">All Categories</option>
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex items-center">
                <select
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-blue-500 focus:outline-none w-full"
                >
                  <option value="">All Countries</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="flex items-center">
                <select
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-blue-500 focus:outline-none w-full"
                >
                  <option value="">All Cities</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center">
                <select
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-blue-500 focus:outline-none w-full"
                >
                  <option value="">All Ratings</option>
                </select>
              </div>

              {/* Discount Filter */}
              <div className="flex items-center">
                <select
                  onChange={(e) => setSelectedDiscount(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-blue-500 focus:outline-none w-full"
                >
                  <option value="">All Discounts</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content with Responsive Advertisements */}
        <div className="flex flex-col gap-4 mb-16 mt-12">
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
              {/* Empty Cards */}
              {Array(4)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#1A8FE3] rounded-3xl p-4 text-white shadow-lg flex flex-col items-center"
                  >
                    <div className="w-full h-64 bg-gray-300 rounded-3xl mb-2"></div>
                    <h2 className="text-2xl font-bold mb-2 text-center">--</h2>
                    <p className="text-md text-center">Category: </p>
                    <p className="text-md text-center">City: </p>
                    <p className="text-md text-center">Country: </p>
                    <p className="text-md text-center">Contact: </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProf;
