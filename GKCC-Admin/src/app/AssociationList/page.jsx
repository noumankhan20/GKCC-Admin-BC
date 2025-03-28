// import SASidebar from '@/components/sidebar/SAsidebar';
import SASidebar from '../../components/sidebar/SAsidebar';
import Header from '../../components/headers/SAheader'
import Banner from '../../components/SAbanner'

import React from 'react';
import AList from '@/components/memberlists/SA-Association/VK-AList';

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <SASidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <Header />
       <Banner/>
        <AList/>
      </div>
    </div>
  );
};

export default members;