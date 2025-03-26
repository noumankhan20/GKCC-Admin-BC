"use client";
import VendorForm from "@/components/vendorForm/VendorForm";
import Footer from "@/components/layouts/footer/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <div>
        <VendorForm />
      </div>
      <div className>
        <Footer />
      </div>
    </div>
  );
};

export default page;
