"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";

import Dropdown from "./Dropdown";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // These states control your main nav dropdowns
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const [isSponsorsDropdownOpen, setIsSponsorsDropdownOpen] = useState(false);

  // New state just for the "Register" dropdown in top bar
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileRoute, setProfileRoute] = useState("/profile");

  const router = useRouter();

  // Toggles for the main nav
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    // Close all dropdowns when opening/closing mobile menu
    setIsDropdownOpen(false);
    setIsManagementDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setIsMediaDropdownOpen(false);
    setIsSponsorsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setActiveTab("");
    if (!isDropdownOpen) {
      setIsManagementDropdownOpen(false);
      setIsAboutDropdownOpen(false);
      setIsMediaDropdownOpen(false);
      setIsSponsorsDropdownOpen(false);
    }
  };

  const toggleManagementDropdown = () => {
    setIsManagementDropdownOpen((prev) => !prev);
    setActiveTab("");
    if (!isManagementDropdownOpen) {
      setIsDropdownOpen(false);
      setIsAboutDropdownOpen(false);
      setIsMediaDropdownOpen(false);
      setIsSponsorsDropdownOpen(false);
    }
  };

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen((prev) => !prev);
    setActiveTab("");
    if (!isAboutDropdownOpen) {
      setIsDropdownOpen(false);
      setIsManagementDropdownOpen(false);
      setIsMediaDropdownOpen(false);
      setIsSponsorsDropdownOpen(false);
    }
  };

  const toggleMediaDropdown = () => {
    setIsMediaDropdownOpen((prev) => !prev);
    setActiveTab("");
    if (!isMediaDropdownOpen) {
      setIsDropdownOpen(false);
      setIsManagementDropdownOpen(false);
      setIsAboutDropdownOpen(false);
      setIsSponsorsDropdownOpen(false);
    }
  };

  const toggleSponsorsDropdown = () => {
    setIsSponsorsDropdownOpen((prev) => !prev);
    setActiveTab("");
    if (!isSponsorsDropdownOpen) {
      setIsDropdownOpen(false);
      setIsManagementDropdownOpen(false);
      setIsAboutDropdownOpen(false);
      setIsMediaDropdownOpen(false);
    }
  };

  // New toggle for the Register dropdown
  const toggleRegisterDropdown = () => {
    setIsRegisterDropdownOpen((prev) => !prev);
  };

  const handleTabClick = (tabName) => {
    const tabsWithActiveBall = [
      "Home",
      "About GKCC",
      "Management",
      "Member Associations",
      "Sponsors / Vendors",
      "Partners",
      "Our Vendors",
      "Our Sponsors",
      "Our Well Wisher",
      "Media",
      "Newsletter",
      "Event Video",
      "Event Photos",
      "Register",
      "Login",
      "Profile",
      "Logout",
    ];

    if (tabsWithActiveBall.includes(tabName)) {
      setActiveTab(tabName);
      localStorage.setItem("activeTab", tabName);
    } else {
      setActiveTab("");
      localStorage.removeItem("activeTab");
    }

    // Close all nav dropdowns after clicking
    setIsManagementDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setIsMediaDropdownOpen(false);
    setIsSponsorsDropdownOpen(false);
    // You could also close the register dropdown here if desired:
    // setIsRegisterDropdownOpen(false);
  };

  const handleMobileLinkClick = (path, tabName) => {
    handleTabClick(tabName);
    router.push(path);
    setIsOpen(false);
  };

  useEffect(() => {
    // Restore active tab
    const savedTab = localStorage.getItem("activeTab");
    const tabsWithActiveBall = [
      "Home",
      "About GKCC",
      "Management",
      "Member Associations",
      "Sponsors / Vendors",
      "Our Vendors",
      "Our Sponsors",
      "Our Well Wisher",
      "Media",
      "Newsletter",
      "Event Video",
      "Event Photos",
    ];
    if (savedTab && tabsWithActiveBall.includes(savedTab)) {
      setActiveTab(savedTab);
    }

    // Check if user is logged in
    const loggedInStatus = localStorage.getItem("token");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }

    // Decide which profile route to show
    const userType = localStorage.getItem("user");
    if (userType === "member") {
      setProfileRoute("/member-profile");
    } else if (userType === "vendor") {
      setProfileRoute("/vendor-profile");
    } else {
      setProfileRoute("/profile");
    }

    // Close dropdowns if user clicks outside
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-item") &&
        !event.target.closest(".nav-button") &&
        !event.target.closest(".register-dropdown-container")
      ) {
        setIsDropdownOpen(false);
        setIsManagementDropdownOpen(false);
        setIsAboutDropdownOpen(false);
        setIsMediaDropdownOpen(false);
        setIsSponsorsDropdownOpen(false);
        setIsRegisterDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    handleTabClick("Logout");
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-white shadow-md ">
        {/* Top Authentication Bar (Desktop Only) */}
        <div className="hidden lg:flex justify-end items-center px-6 h-10">
          {isLoggedIn ? (
            <>
              <Link
                href={profileRoute}
                className="px-3 py-1 border border-[#1A8FE3] text-[#1A8FE3] rounded-sm hover:bg-[#1A8FE3] hover:text-white text-xs nav-button"
                onClick={() => handleTabClick("Profile")}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 border border-[#1A8FE3] text-[#1A8FE3] rounded-sm hover:bg-[#1A8FE3] hover:text-white text-xs nav-button"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* Register Dropdown */}
              <div className="relative register-dropdown-container px-9">
                <button
                  onClick={toggleRegisterDropdown}
                  className="px-3 py-1 border border-[#1A8FE3] text-[#1A8FE3] rounded-sm hover:bg-[#1A8FE3] hover:text-white text-xs flex items-center nav-button"
                >
                  Register
                  <IoMenu className="inline ml-1" />
                </button>
                {isRegisterDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 border border-black bg-white rounded-lg shadow-lg z-50">
                    <Link
                      href="/association-form"
                      className="block px-4 py-2 text-black hover:bg-[#1A8FE3] hover:text-white"
                      onClick={() => {
                        handleTabClick("Register");
                        setIsRegisterDropdownOpen(false);
                      }}
                    >
                      Association Membership
                    </Link>
                    <Link
                      href="/vendor-form"
                      className="block px-4 py-2 text-black hover:bg-[#1A8FE3] hover:text-white"
                      onClick={() => {
                        handleTabClick("Register");
                        setIsRegisterDropdownOpen(false);
                      }}
                    >
                      Vendors Membership
                    </Link>
                    <Link
                      href="/membership-form"
                      className="block px-4 py-2 text-black hover:bg-[#1A8FE3] hover:text-white"
                      onClick={() => {
                        handleTabClick("Register");
                        setIsRegisterDropdownOpen(false);
                      }}
                    >
                      Individual Membership
                    </Link>
                  </div>
                )}
              </div>

              {/* Log in */}
              <Link
                href="/login-form"
                className="ml-2 px-3 py-1 border border-[#1A8FE3] text-[#1A8FE3] rounded-sm hover:bg-[#1A8FE3] hover:text-white text-xs nav-button"
                onClick={() => handleTabClick("Login")}
              >
                Log in
              </Link>
            </>
          )}
        </div>

        {/* Main Navigation Bar */}
        <div className="flex justify-between items-center px-6 lg:px-6 h-20">
          {/* Logo and Site Title */}
          <div className="flex items-center gap-2">
            <Link href="/" onClick={() => handleTabClick("Home")}>
              <Image
                src="/images/gkcclogo.png"
                alt="Logo"
                width={120}
                height={120}
                className="nav-logo"
              />
            </Link>
            <Link href="/" onClick={() => handleTabClick("Home")}>
              <span className="text-xs lg:text-sm font-bold cursor-pointer">
                Global Kokani Committees&apos; Council
              </span>
            </Link>
          </div>

          {/* Desktop Main Navigation Links */}
          <div className="hidden lg:flex flex-row gap-4 items-center">
            <Link
              href="/"
              onClick={() => handleTabClick("Home")}
              className={`nav-item flex flex-col items-center cursor-pointer p-2 ${
                activeTab === "Home" ? "text-[#1A8FE3]" : "text-black"
              }`}
            >
              <h3 className="font-medium text-xs lg:text-sm">Home</h3>
            </Link>

            <Dropdown
              title="About GKCC"
              mainPath="/#AboutGKCC"
              isOpen={isAboutDropdownOpen}
              toggleDropdown={toggleAboutDropdown}
              items={[
                { label: "Vision/Mission", path: "/aboutus#vision-mission" },
                { label: "Core Values", path: "/aboutus#core-values" },
                {
                  label: "Strategies / Action Plans",
                  path: "/aboutus#strategies-actions",
                },
              ]}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

            <Dropdown
              title="Management"
              mainPath="/#ManagementSection"
              isOpen={isManagementDropdownOpen}
              toggleDropdown={toggleManagementDropdown}
              items={[
                { label: "Office Bearers", path: "/managements/#OfficeBearers" },
                {
                  label: "Executive Council",
                  path: "/managements/#ExecutiveManagers",
                },
                {
                  label: "Coordination Council",
                  path: "/managements/#CoordinationCommittees",
                },
                { label: "Patrons/Advisors", path: "/managements/#Advisors" },
                {
                  label: "Sub Committees",
                  path: "/managements/#InternalCommittee",
                },
              ]}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

            <Dropdown
              title="Partners"
              mainPath="/#VendorsSection"
              isOpen={isSponsorsDropdownOpen}
              toggleDropdown={toggleSponsorsDropdown}
              items={[
                { label: "Our Sponsors", path: "/partners#our-sponsors" },
                { label: "Our Vendors", path: "/partners#vendors" },
                { label: "Our Well Wishers", path: "/partners#wellwishers" },
              ]}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

            <Dropdown
              title="Media"
              mainPath="/#MediaSection"
              isOpen={isMediaDropdownOpen}
              toggleDropdown={toggleMediaDropdown}
              items={[
                { label: "Newsletters", path: "/media#newsletter" },
                { label: "Event Videos", path: "/media#eventvideo" },
                { label: "Pictures Gallery", path: "/media#eventphoto" },
              ]}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

            <Link
              href="/#MemberAssociationsSection"
              onClick={() => handleTabClick("Member Associations")}
              className="nav-item flex flex-col items-center cursor-pointer p-2"
            >
              <h3
                className={`font-medium text-xs lg:text-sm ${
                  activeTab === "Member Associations" ? "text-[#1A8FE3]" : ""
                }`}
              >
                Member Associations
              </h3>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu} className="text-3xl">
              {isOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so content isn’t hidden behind fixed navbar */}
      <div className="h-16 lg:h-[104px]"></div>

      {/* Mobile Menu */}
      {isOpen && (
        <MobileMenu
          toggleMenu={toggleMenu}
          handleMobileLinkClick={handleMobileLinkClick}
          isAboutDropdownOpen={isAboutDropdownOpen}
          toggleAboutDropdown={toggleAboutDropdown}
          isManagementDropdownOpen={isManagementDropdownOpen}
          toggleManagementDropdown={toggleManagementDropdown}
          isSponsorsDropdownOpen={isSponsorsDropdownOpen}
          toggleSponsorsDropdown={toggleSponsorsDropdown}
          isMediaDropdownOpen={isMediaDropdownOpen}
          toggleMediaDropdown={toggleMediaDropdown}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          profileRoute={profileRoute}
        />
      )}
    </>
  );
};

export default Navbar;
