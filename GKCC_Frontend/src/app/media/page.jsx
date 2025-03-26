import React from 'react'
import Navbar from '@/components/layouts/navbar/Navbar'
import NewsLetter from '@/components/newsletter/newsletter'
import EventVideos from '@/components/media/EventVideos';
import EventPhotos from '@/components/media/EventPhotos';
import Footer from '@/components/layouts/footer/Footer';

const page = () => {
  return (
    <div className='w-screen h-screen '>
      <Navbar />
      <div >
        <section id='newsletter'>
      <NewsLetter />
      </section>
      </div>
      <section id='eventphoto'>

      <EventPhotos/>
      </section>
      <section id='eventvideo'>
      <EventVideos/>
      </section>
      <Footer/>

    </div>
  )
}

export default page