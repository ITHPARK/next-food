import React from 'react'
import { StoreType } from '../../types/types';
import Image from 'next/image';


// 서버 측에서 데이터 패칭
const fetchStores = async() => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  if (!response.ok) {
    throw new Error('페칭 실패');
  }
  return response.json();
}

const StoreListPage = async() => {

  const stores: StoreType[] = await fetchStores();

  return (
    <div className='px-4 md:max-w-5xl mx-auto py-8'>
        <ul role='list' className='divide-y divide-gray-100'>
          {stores?.map((store, index) => {
              return (
                <li className='flex justify-between gap-x-6 py-5' key={index}>
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
                    <div className='hidden sm:flex sm:flex-col sm:items-end'>
                       <div className='text-sm font-semibold leading-6 text-gray-900'>
                          {store?.address}
                        </div>
                        <div className='mt-1 text-xs truncate font-semibold leading-5 text-gray-500'>
                          {store?.phone || "번호 정보 없음"} | &nbsp;
                          { store?.foodCertifyName} | &nbsp;
                          { store?.category}
                        </div>
                    </div>
                </li>
              )
          })}
        </ul>
        
    </div>
  )
}

export default StoreListPage