import SASidebar from "@/components/sidebar/SAsidebar";
import SAHeader from "@/components/headers/SAheader";
import SABanner from "@/components/SAbanner";
import React from "react";
import SAMemberListPage from "@/components/memberlists/SA-Member/SAMemberListPage";

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
     <SASidebar/>
      <div className="flex-1 p-4 overflow-y-auto">
        <SAHeader />
        <SABanner />
        <SAMemberListPage />
      </div>
    </div>
  );
};

export default members;
// dada jogeshwari