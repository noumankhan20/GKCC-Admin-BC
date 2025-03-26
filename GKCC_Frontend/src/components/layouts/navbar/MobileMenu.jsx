"use client";
import React from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const MobileMenu = ({
  toggleMenu,
  handleMobileLinkClick,
  isAboutDropdownOpen,
  toggleAboutDropdown,
  isManagementDropdownOpen,
  toggleManagementDropdown,
  isSponsorsDropdownOpen,
  toggleSponsorsDropdown,
  isMediaDropdownOpen,
  toggleMediaDropdown,
  isLoggedIn,
  handleLogout,
  profileRoute,
}) => {
  return (
    <div className="lg:hidden flex flex-col items-start bg-white gap-5 top-0 left-0 px-10 fixed inset-0 z-50 overflow-y-auto">
      {/* Menu Header */}
      <div className="flex justify-between items-center w-full py-3">
        <div className="text-base font-bold">Menu</div>
        <button onClick={toggleMenu} className="text-3xl">
          <IoClose />
        </button>
      </div>

      {/* Mobile Nav Links */}
      <Link
        href="/#HeroBanner"
        onClick={() => handleMobileLinkClick("/#HeroBanner", "Home")}
        className="nav-item"
      >
        <h3 className="font-medium text-base">Home</h3>
      </Link>

      {/* About GKCC Dropdown */}
      <div className="relative w-full">
        <div
          onClick={toggleAboutDropdown}
          className="nav-item flex flex-col relative cursor-pointer"
        >
          <h3 className="font-medium text-base">
            About GKCC <IoIosArrowDown className="inline ml-1" />
          </h3>
        </div>
        {isAboutDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-lg shadow-lg z-50 overflow-hidden">
            <Link
              href="/aboutus/vission"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/aboutus/vission", "About GKCC")
              }
            >
              Vision/Mission
            </Link>
            <Link
              href="/aboutus/corevalues"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/aboutus/corevalues", "About GKCC")
              }
            >
              Core Values
            </Link>
            <Link
              href="/aboutus/whatwedo"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/aboutus/whatwedo", "About GKCC")
              }
            >
              What We Do
            </Link>
          </div>
        )}
      </div>

      {/* Management Dropdown */}
      <div className="relative w-full">
        <div
          onClick={toggleManagementDropdown}
          className="nav-item flex flex-col relative cursor-pointer"
        >
          <h3 className="font-medium text-base">
            Management <IoIosArrowDown className="inline ml-1" />
          </h3>
        </div>
        {isManagementDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-lg shadow-lg z-50 overflow-hidden">
            <Link
              href="/managements/#OfficeBearers"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick(
                  "/managements/#OfficeBearers",
                  "Management"
                )
              }
            >
              Office Bearers
            </Link>
            <Link
              href="/managements/#ExecutiveManagers"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick(
                  "/managements/#ExecutiveManagers",
                  "Management"
                )
              }
            >
              Executive Council
            </Link>
            <Link
              href="/managements/#CoordinationCommittees"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick(
                  "/managements/#CoordinationCommittees",
                  "Management"
                )
              }
            >
              Coordination Council
            </Link>
            <Link
              href="/managements/#Advisors"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/managements/#Advisors", "Management")
              }
            >
              Patrons/Advisors
            </Link>
            <Link
              href="/managements/#InternalCommittee"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick(
                  "/managements/#InternalCommittee",
                  "Management"
                )
              }
            >
              Sub Committees
            </Link>
          </div>
        )}
      </div>

      {/* Member Associations */}
      <Link
        href="/#MemberAssociationsSection"
        onClick={() =>
          handleMobileLinkClick("/#MemberAssociationsSection", "Member Associations")
        }
        className="nav-item"
      >
        <h3 className="font-medium text-base">Member Associations</h3>
      </Link>

      {/* Partners Dropdown */}
      <div className="relative w-full">
        <div
          onClick={toggleSponsorsDropdown}
          className="nav-item flex flex-col relative cursor-pointer"
        >
          <h3 className="font-medium text-base">
            Partners <IoIosArrowDown className="inline ml-1" />
          </h3>
        </div>
        {isSponsorsDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-lg shadow-lg z-50 overflow-hidden">
            <Link
              href="/partners#our-sponsors"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/partners#our-sponsors", "Our Sponsors")
              }
            >
              Our Sponsors
            </Link>
            <Link
              href="/partners#vendors"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/partners#vendors", "Our Vendors")
              }
            >
              Our Vendors
            </Link>
            <Link
              href="/partners#wellwishers"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/partners#wellwishers", "Our Well Wisher")
              }
            >
              Our Well Wishers
            </Link>
          </div>
        )}
      </div>

      {/* Media Dropdown */}
      <div className="relative w-full">
        <div
          onClick={toggleMediaDropdown}
          className="nav-item flex flex-col relative cursor-pointer"
        >
          <h3 className="font-medium text-base">
            Media <IoIosArrowDown className="inline ml-1" />
          </h3>
        </div>
        {isMediaDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-lg shadow-lg z-50 overflow-hidden">
            <Link
              href="/media/#Newsletters"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/media/#Newsletters", "Newsletter")
              }
            >
              Newsletters
            </Link>
            <Link
              href="/event-videos"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/event-videos", "Event Video")
              }
            >
              Event Videos
            </Link>
            <Link
              href="/event-photos"
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/event-photos", "Event Photos")
              }
            >
              Pictures Gallery
            </Link>
          </div>
        )}
      </div>

      {/* Authentication Buttons */}
      <div className="flex flex-col gap-3 w-full">
        {isLoggedIn ? (
          <>
            <Link
              href={profileRoute}
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
              onClick={() => handleMobileLinkClick(profileRoute, "Profile")}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/association-form"
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/association-form", "Register")
              }
            >
              Association Membership
            </Link>
            <Link
              href="/vendor-form"
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
              onClick={() => handleMobileLinkClick("/vendor-form", "Register")}
            >
              Vendors Membership
            </Link>
            <Link
              href="/membership-form"
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
              onClick={() =>
                handleMobileLinkClick("/membership-form", "Register")
              }
            >
              Individual Membership
            </Link>
            <Link
              href="/login-form"
              className="block w-full text-center px-4 py-2 border border-[#1A8FE3] text-[#1A8FE3] rounded hover:bg-[#1A8FE3] hover:text-white text-base"
              onClick={() => handleMobileLinkClick("/login-form", "Login")}
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
