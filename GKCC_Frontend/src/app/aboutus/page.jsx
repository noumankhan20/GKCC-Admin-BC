"use client";

import { useEffect } from "react";
import Navbar from "@/components/layouts/navbar/Navbar";
import Footer from "@/components/layouts/footer/Footer";

import VisionMission from "@/components/aboutus/vissionmission";
import CoreValues from "@/components/aboutus/corevalue";
import StrategiesActions from "@/components/aboutus/StrategiesActions";

const Page = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="w-screen h-screen ">
      <Navbar />

      <section id="vision-mission">
        <VisionMission />
      </section>

      <section id="core-values">
        <CoreValues />
      </section>

      <section id="strategies-actions">
        <StrategiesActions />
      </section>

      <Footer />
    </div>
  );
};

export default Page;
