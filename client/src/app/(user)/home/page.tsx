'use client'
import React from 'react'
import dynamic from 'next/dynamic';

const Map = dynamic(
    () => import('@/components/map'),
    {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
    }
);
const Page = () => {
  return (
    <div className='h-screen, w-4/4'>
        <Map posix={[27.7103, 85.3222]} />
       

    </div>
  )
}

export default Page
