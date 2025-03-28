import VKheader from '@/components/vk/VKheader'
import VKSidebar from '@/components/vk/VKsidebar'
import VKBanner from '@/components/vk/VKbanner'
import React from 'react'

const vk = () => {
    return (
        <div className='flex bg-white min-h-screen'>
            <VKSidebar />
            <div className="flex-1 p-4 overflow-y-auto">
                <VKheader />
                <VKBanner />

            </div>
        </div>
    )
}

export default vk
