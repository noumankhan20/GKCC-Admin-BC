"use client";
import Footer from "@/components/layouts/footer/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="mt-4 h-full">
        <embed
          src="/sponsordata/123.pdf"
          width="100%"
          height="100%"
          type="application/pdf"
          title="PDF Document"
        />
      </div>
    </div>
  );
};

export default Page;
