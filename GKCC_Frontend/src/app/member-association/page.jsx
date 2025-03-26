import Footer from '@/components/layouts/footer/Footer'
import Navbar from '@/components/layouts/navbar/Navbar'
import MemberAssociation from '@/components/memberAssociation/MemberAssociation'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div >
      <MemberAssociation/>
      <Footer/>
    </div>
    </div>
  )
}

export default page;