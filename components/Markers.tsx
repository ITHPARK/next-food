"use client"

import React, {useEffect, useCallback} from 'react'
import {MarkerProps} from "../types/types";




const Makers = ({map, storeDatas, setcurrentStore}: MarkerProps) => {

    const loadKakaoMarkers = useCallback(() => {
        if(map) {
             //식당 데이터 마커 띄우기 
             storeDatas?.map((store: any) => {


                //마커 이미지 커스텀
                const imageSrc = store?.bizcnd_code_nm ? `/images/markers/${store?.bizcnd_code_nm}.png` :  `/images/markers/default.png`
                const imageSize = new window.kakao.maps.Size(40, 40);
                const imageOption = {offset: new window.kakao.maps.Point(27, 69)};

                const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
                )
                
                const markerposition = new window.kakao.maps.LatLng(
                store?.y_dnts,
                store?.x_cnts
                );

                const marker = new window.kakao.maps.Marker({
                position: markerposition,
                image: markerImage
                });

                //marker를 map에 띄움
                marker.setMap(map);

                //마커 커서가 호버되었을 때 마커 위에 표시할 인포윈도우
                const content = `<div class="infowindow">${store?.upso_nm}</div>`; //인포윈도우에 표시될 내용

                //커스텀 오버레이 생성
                const customOverlay = new window.kakao.maps.CustomOverlay({
                position: markerposition,
                content: content,
                xAnchor: 0.6,
                yAnchor: 0.91,
                });

                window.kakao.maps.event.addListener(marker, "mouseover", function(){
                //마커에 마우스오버 시 커스텀 오버레이를 띄운다
                customOverlay.setMap(map);
                });

                window.kakao.maps.event.addListener(marker, "mouseout", function(){
                //마우스를 때면 오버레이를 닫는다.
                customOverlay.setMap(null);
                });

                //선택한 가게 저장
                window.kakao.maps.event.addListener(marker, "click", function(){
                  setcurrentStore(store)
                })

                // let newMarker = new window.kakao.Marker({
                //   position: marker,
                // })
            })
        }
        //map, storeDatas, setcurrentStore 값이 변경될 때 새로운 콜백을 실행
    },[map, storeDatas, setcurrentStore])

    
    useEffect(() => {
    
      loadKakaoMarkers();
 
    }, [map, loadKakaoMarkers])
    


  return (
    <></>
  )
}

export default Makers