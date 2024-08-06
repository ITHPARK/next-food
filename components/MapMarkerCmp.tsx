"use client"

import React, {useState, useEffect} from 'react'
import Map from "./Map";
import Markers from "./Markers";
import StoreBox from "./StoreBox";
import { StoreType } from '../types/types';
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import Loading from "./Loading";

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

    // const storeDatas = stores.map(item => ({
    //     id: id || '',  // tel_no가 null이면 빈 문자열로 설정
    //     cob_code_nm: item.cob_code_nm,
    //     bizcnd_code_nm: item.bizcnd_code_nm,
    //     upso_nm: item.upso_nm,
    //     x_cnts: item.x_cnts,
    //     y_dnts: item.y_dnts,
    //     rdn_code_nm: item.rdn_code_nm,
    //     crtfc_gbn_nm: item.crtfc_gbn_nm,
    // }));


  if (isLoading) return <Loading/>;
  if (isError) return <div className='w-full h-screen mx-auto pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;


  return (
    <div>
        <Map setMap={setMap}/>
        <Markers map={map} storeDatas={stores} setcurrentStore={setcurrentStore}/>
        <StoreBox store={currentStore} setStore = {setcurrentStore}/>
    </div>
  )
}

export default MapMarkerCmp