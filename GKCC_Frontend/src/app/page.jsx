"use client";

import React from "react";
import Navbar from "../components/layouts/navbar/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import OurSponsors from "@/components/home/OurSponsors";
import AboutGKCC from "@/components/home/AboutGKCC";
import ManagementSection from "@/components/home/ManagementSection";
import MemberAssociationsSection from "@/components/home/MemberAssociationsSection";
import PartnersSection from "@/components/home/VendorsSection";
import MediaSection from "@/components/home/MediaSection";
import Footer from "@/components/layouts/footer/Footer";

const page = () => {
  return (
    <div className="w-screen h-screen relative  ">
      <Navbar />
      <div id="HeroBanner" >
        <HeroBanner />
      </div>
      <div id="OurSponsors">
        <OurSponsors />
      </div>
      <div id="AboutGKCC">
        <AboutGKCC />
      </div>
      <div id="ManagementSection">
        <ManagementSection />
      </div>
      <div id="MemberAssociationsSection">
        <MemberAssociationsSection />
      </div>
      <div id="VendorsSection">
        <PartnersSection />
      </div>
      <div id="MediaSection">
        <MediaSection />
      </div>
      <Footer />
    </div>
  );
};

export default page;
