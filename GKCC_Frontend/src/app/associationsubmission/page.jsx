import SubmissionSuccess from '@/components/associationForm/submittedform'
import Footer from '@/components/layouts/footer/Footer'
import Navbar from '@/components/layouts/navbar/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <SubmissionSuccess/>
        <Footer/>
    </div>
  )
}

export default page