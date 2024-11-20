"use client"

import React from 'react'
import Image from 'next/image';
import {useRouter} from "next/navigation";
import {StoreListProps} from "../types/types";

const StoreListSub = ({store, i}: StoreListProps) => {

  const router = useRouter();

  return (
      <li key={`list${store.id}`} className='flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50' onClick={() => router.push(`/stores/${store.id}`)}>
        <div className='flex gap-x-4'>
          <Image 
            src={store?.category? `/images/markers/${store?.category}.png`: "/images/markers/default.png"} 
            width={48} 
            height={48} 
            alt='아이콘 이미지'>
          </Image>  
          <div>
            <div className='text-sm font-semibold leading-6 text-gray-900'>
              {store?.name}
            </div>
            <div className='mt-1 text-xs truncate font-semibold leading-5 text-gray-500'>
              {store?.storeType}
            </div>
          </div>
        </div> 
        <div className='hidden sm:flex sm:flex-col sm:stores-end'>
          <div className='flex justify-end text-sm font-semibold leading-6 text-gray-900'>
            {store?.address}
          </div>
          <div className='mt-1 flex justify-end text-xs truncate font-semibold leading-5 text-gray-500'>
            {store?.phone || "번호 정보 없음"} | &nbsp;
            { store?.foodCertifyName} | &nbsp;
            { store?.category}
          </div>
        </div>
      </li>
   
  )
}

export default StoreListSub
