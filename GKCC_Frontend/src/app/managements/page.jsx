import Footer from "@/components/layouts/footer/Footer";
import Advisors from "@/components/managementPages/Advisors";
import CoordinationCommittees from "@/components/managementPages/CoordinationCommittees";
import ExecutiveManagers from "@/components/managementPages/ExecutiveManagers";
import InternalCommittee from "@/components/managementPages/Internal-Committee";
import OfficeBearers from "@/components/managementPages/OfficeBearers";

import React from "react";

const page = () => {
  return (
    <>
      <div>
        <section id="OfficeBearers">
          <OfficeBearers /> 
        </section>

        <section id="ExecutiveManagers">
          <ExecutiveManagers />
        </section>

        <section id="CoordinationCommittees">
          <CoordinationCommittees />
        </section>

        <section id="Advisors">
          <Advisors />
        </section>

        <section id="InternalCommittee">
          <InternalCommittee />
        </section>

        <div className="md:mt-[10%] lg:mt-[10%]">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default page;
