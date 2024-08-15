import React from 'react'

    const FullPageLoader = () => {
        return (
            <div className='fixed w-full top-0 inset-x-0 h-screen flex flex-col justify-center bg-black/60 z-50'>
                <div className='animate-spin w-10 h-10 text-blue-400 rounded-full border-[4px] border-t-transparent border-current m-auto '></div>
            </div>
        )
    }

export default FullPageLoader
