"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

const Dropdown = ({
  title,
  mainPath,
  isOpen,
  toggleDropdown,
  items,
  activeTab,
  handleTabClick,
}) => {
  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="nav-item flex flex-col items-center relative cursor-pointer p-2"
      >
        <h3
          className={`font-medium text-xs lg:text-sm ${
            activeTab === title ? "text-[#1A8FE3]" : "text-black"
          }`}
        >
          <Link href={mainPath ?? "#"}>{title}</Link>{" "}
          <IoIosArrowDown className="inline ml-1" />
        </h3>

        {/* {activeTab === title && (
          <div className="w-2 h-2 bg-[#1A8FE3] rounded-full absolute mt-1"></div>
        )} */}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black rounded-lg shadow-lg z-50 overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="block px-4 py-2 text-black hover:bg-black hover:text-white text-xs"
              onClick={() => handleTabClick(title)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
