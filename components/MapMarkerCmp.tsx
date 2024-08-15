"use client"

import React, {useState} from 'react'
import Map from "./Map";
import Markers from "./Markers";
import StoreBox from "./StoreBox";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import Loading from "./Loading";
import CurrentLocation from "./CurrentLocation";


//컴포넌트가 생성 될때 마다 함수가 새로 생성되는걸 방지해서 밖에 작성
const fetchStores = async () => {
  try {
    const { data } = await axios.get("/api/stores");
    return data;
  } catch (error) {
    console.error('Error fetching stores:', error);  // 오류 로그 추가
    throw error;
  }
};


const MapMarkerCmp = () => {

    const [map, setMap] = useState(null);
    const [currentStore, setcurrentStore] = useState(null);

    const { data: stores, isError, isLoading } = useQuery({
      queryKey: ["stores"],
      queryFn: fetchStores,
    });

  if (isLoading) return <Loading/>;
  if (isError) return <div className='w-full h-screen mx-auto pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;


  return (
    <div>
        <Map/>
        <Markers storeDatas={stores} setcurrentStore={setcurrentStore}/>
        <StoreBox/>
        <CurrentLocation/>
    </div>
  )
}

export default MapMarkerCmp