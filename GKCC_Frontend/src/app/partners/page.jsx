import Footer from "@/components/layouts/footer/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import Sponsors from "@/components/sponsors/sponsors";
import VendorProf from "@/components/vendors/VendorProf";
import WellWishers from "@/components/wellwishers/wellwishers";
import React from "react";

const page = () => {
  return (
    <div>
      
      <Navbar />
      <div >

      <section id="our-sponsors">
        <Sponsors />
      </section>

      <section id="vendors">
        <VendorProf />
        </section>

        <section id="wellwishers">
        <WellWishers />
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default page;
