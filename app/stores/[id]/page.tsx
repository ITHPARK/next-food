"use client"

import React, { useEffect ,useState } from 'react'
import { useParams } from 'next/navigation';
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {StoreType} from "../../../types/types";
import Loading from "../../../components/Loading";
import Map from "../../../components/Map";
import Marker from "../../../components/Marker";


const fetchStore = async (id: string) => {
  const response = await axios(`/api/stores?id=${id}`);
  if (!response) {
    throw new Error('Network response was not ok');
  }
  return response.data as StoreType;
};


const StorePage = () => {

  const [map, setMap] = useState(null);

  const {id} = useParams();

  // id가 배열인 경우 첫 번째 요소를 사용
  const storeId = Array.isArray(id) ? id[0] : id;

  const { data, isError, isLoading , isSuccess} = useQuery({
    queryKey: [`store-${id}`],
    queryFn: () => fetchStore(storeId),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    refetchOnWindowFocus: false, // 창을 바꿀때마다 새로고침 되는걸 막는다
  });

  if (isError) return <div className='w-full h-screen mx-auto  pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;

  if(isLoading) return <Loading/>

  return (
    <>
      <div className='max-w-5xl mx-auto px-4 py-8'>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{data?.name}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{data?.address}</p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">카테고리</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.category || "카테고리 정보 없음"}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">주소</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.address}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">위도</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.lat}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">경도</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.lng}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">연락처</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data?.phone || "연락처 정보 없음"}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">식품인증구분</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data?.foodCertifyName || "식품인증 정보 없음"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">없종명</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data?.storeType || "업종 정보 없음"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* map area */}
      {
        isSuccess &&
        <div className='overflow-hidden w-full mb-20 max-w-5xl mx-auto max-h-[600px]'>
          <Map setMap={setMap} lat={data?.lat} lng={data?.lng} zoom={1}/>
          <Marker map={map} store={data}/>
        </div>
        
      }
      
    </>
      
  )
}

export default StorePage