import VMemberlist from '@/components/memberlists/Vmemberlist'
import VKBanner from '@/components/vk/VKbanner'
import VKheader from '@/components/vk/VKheader'
import VKSidebar from '@/components/vk/VKsidebar'
import React from 'react'

const page = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <VKSidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <VKheader/>
        <VKBanner/>
        <VMemberlist/>
      </div>
    </div>
  )
}

export default page
