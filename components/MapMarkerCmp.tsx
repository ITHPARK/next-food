"use client"

import React, {useState, useEffect} from 'react'
import Map from "./Map";
import Markers from "./Markers";
import StoreBox from "./StoreBox";
import { StoreType } from '../types/types';



const MapMarkerCmp = ({stores}: {stores: StoreType[]}) => {

    const [map, setMap] = useState(null);
    const [currentStore, setcurrentStore] = useState(null);

    const storeDatas = stores.map(item => ({
        tel_no: item.tel_no || '',  // tel_no가 null이면 빈 문자열로 설정
        cob_code_nm: item.cob_code_nm,
        bizcnd_code_nm: item.bizcnd_code_nm,
        upso_nm: item.upso_nm,
        x_cnts: item.x_cnts,
        y_dnts: item.y_dnts,
        rdn_code_nm: item.rdn_code_nm,
        crtfc_gbn_nm: item.crtfc_gbn_nm,
    }));


    useEffect(() => {
       
    }, [currentStore, setcurrentStore])


  return (
    <div>
        <Map setMap={setMap}/>
        <Markers map={map} storeDatas={storeDatas} setcurrentStore={setcurrentStore}/>
        <StoreBox store={currentStore} setStore = {setcurrentStore}/>
    </div>
  )
}

export default MapMarkerCmp