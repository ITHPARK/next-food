/*global kakao */
"use client";

import React, { useEffect } from 'react';
import Script from "next/script";
import {MapProps} from "../types/types";


//declare로 전역 타입 선언
declare global {
    interface Window {
      kakao: any;
    }
};

const Map = ({setMap, lat, lng, zoom}: MapProps) => {

    const DEFAULT_LAT = 37.566826;
    const DEFAULT_LNG = 126.978656;

    const DEFAULT_ZOOM = 3;


  const loadKakaoMap = () => {
    
    // 지도 로드
    window.kakao.maps.load(() => {
      // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(lat ?? DEFAULT_LAT, lng ??  DEFAULT_LNG), // 지도 중심좌표
        level: zoom ?? DEFAULT_ZOOM, // 지도의 확대 레벨
      }
      //맵 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      setMap(map);
    });
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }
  }, []);

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        onLoad={loadKakaoMap}
      />
      <div id="map" className="w-full h-screen"></div>
    </div>
  );
}

export default Map;
