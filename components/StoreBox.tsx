"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {
    AiOutlineClose,
    AiOutlineInfoCircle,
    AiOutlineCheck,
    AiOutlinePhone,
} from "react-icons/ai";
import { HiOutlineMapPin } from "react-icons/hi2";
import { useRouter } from 'next/navigation';
import {useRecoilState} from "recoil"
import {currentStoreState} from '../atom'
import Like from "../components/Like";

const StoreBox = ( ) => {

    const [storeInfo, setSotreInfo] = useState();
    const router = useRouter();

    const [store, setStore] = useRecoilState(currentStoreState);

  return (
    <div className='fixed transition ease-in-out delay-150 inset-x-0 mx-auto bottom-20 rounded-lg max-w-sm md:max-w-xl z-10 w-full bg-white'>
        {store && (
            <>
                <div className='p-4'>
                    <div className='flex justify-between items-start'>
                        <div className='flex gap-4 items-center'>
                            <Image src={store?.category ? `/images/markers/${store?.category}.png`: `/images/markers/default.png`} width={40} height={40} alt="image"></Image>
                            <div>
                                <h2 className='font-semibold'>{store?.name}</h2>
                                <p className='text-sm'>{store?.storeType}</p>
                            </div>
                        </div>
                        <button type='button' onClick={() => {setStore(null)}}><AiOutlineClose fill="#141414" size="20"/></button>
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-4">
                        <div className=" flex gap-2 items-center col-span-3">
                            <HiOutlineMapPin />
                            {store?.address || "주소가 없습니다."}
                        </div>
                        <Like storeId={store.id} />
                    </div>
                    <div className="mt-2 flex gap-2 items-center">
                        <AiOutlinePhone />
                        {store?.phone || "연락처 정보 없음"}
                    </div>
                    <div className="mt-2 flex gap-2 items-center">
                        <AiOutlineInfoCircle />
                        {store?.storeType || "유형 없음"}
                    </div>
                    <div className="mt-2 flex gap-2 items-center">
                        <AiOutlineCheck />
                        {store?.category || "분류 없음"}
                    </div>
                </div>
                <button type='button' onClick={() => router.push(`/stores/${store.id}`)} className='w-full bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 py-3 text-white font-semibold rounded-b-lg'>상세보기</button>
            </>
        )}
    </div>
  )
}

export default StoreBox