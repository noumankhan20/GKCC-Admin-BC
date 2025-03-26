import Sidebar from '@/components/sidebar/SAsidebar';
import Header from '@/components/headers/SAheader';
import SABanner from '@/components/SAbanner';
import React from 'react';
import AMemberList from '@/components/memberlists/SA-Association/Amemberlist';

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <Header />
        <SABanner />
        <AMemberList /> 
      </div>
    </div>
  );
};

export default members;