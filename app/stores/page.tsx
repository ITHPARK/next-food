

import React from 'react'
import { StoreType } from '../../types/types';
import Image from 'next/image';
import StoreList from "../../components/StoreList"


const StoreListPage = async() => {  

  return (
    <div className='px-4 md:max-w-5xl mx-auto pt-[52px] pb-8'>
        <StoreList></StoreList> 
    </div>
  )
}

export default StoreListPage
