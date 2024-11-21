"use client"

import React, {useState} from 'react'
import { MdMyLocation  } from "@react-icons/all-files/md/MdMyLocation";
import {useRecoilValue} from "recoil";
import {mapState} from "../atom"
import {toast} from "react-toastify";
import  FullPageLoader  from "./FullPageLoader"

const CurrentLocation = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const map = useRecoilValue(mapState);

    const handleCurrent = () => {

        setLoading(true);

        //브라우저의 geolocation으로 사용자 현재위치 가져오기
        const options = {
            enableHighAccuracy: false, //정확도를 높이는 설정 true로 하면 시간이 오래걸릴수 있음
            timeout: 5000, //타임아웃 값
            maximumAge: Infinity, //위치값을 캐싱하는 옵션
        }

        if(navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => { 

                    //geolocation로 가져온 위치값을 카카오맵에 적용 시킨다.
                    const currentPosition = new window.kakao.maps.LatLng (
                        position.coords.latitude,
                        position.coords.longitude
                    )

                    if(currentPosition) {
                        setLoading(false);
                        map.panTo(currentPosition); //Kakao Maps API에서 현재위치로 지도 이동
                        toast.success("현재 위치로 이동되었습니다.");
                    }
                    return currentPosition;
                }, // 성공했을 때
                () => {
                    toast.error("현재 위치로 가져올 수 없습니다.")
                    setLoading(false);
                }, // 실패했을 때
                options // 옵션
            )
        }
 
    }

    return (
        <>
            {loading && <FullPageLoader />}
            <button 
                type='button' 
                onClick={handleCurrent} 
                className='fixed z-10 p-2 shadow right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow hover:bg-orange'
            >
                <MdMyLocation className='w-5- h-5'/>
            </button>
        </>
    )
}

export default CurrentLocation
