
import React from "react";
import SAMemberListPage from "@/components/memberlists/SA-Member/SAMemberListPage";
import VKSidebar from "@/components/vk/VKsidebar";
import VKheader from "@/components/vk/VKheader";
import SASidebar from "@/components/sidebar/SAsidebar";
import VKBanner from "@/components/vk/VKbanner";

const page = () => {
  return (
    <div className="flex bg-white min-h-screen">
     <VKSidebar/>
      <div className="flex-1 p-4 overflow-y-auto">
        <VKheader />
        <VKBanner/>
        <SAMemberListPage />
      </div>
    </div>
  );
};

export default page;
// dada jogeshwari