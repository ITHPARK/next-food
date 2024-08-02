import React from 'react'
import { LayoutProps } from '../types/types'

const Loading = () => {
  return (
    <>
    <div className='w-full h-20 animate-pulse bg-gray-200 rounded-md'>Loading</div>
    {[...Array(10)].map((e, i) => (
        <div className='w-full h-20 animate-pulse bg-gray-200 rounded-md mt-2' key={i}>Loading</div>
    ))}
    
    </>
    
  )
}

export default Loading