"use client"

import React from 'react'
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { LikeApiResponse, LikeInterface } from '../../../types/types';
import Loading from "../../../components/Loading";
import StoreListSub from '../../../components/StoreListSub';
import Pagination from "../../../components/Pagination";
import { useSearchParams } from 'next/navigation';


const LikesPage = () => {

  //페이지 url에서 쿼리번호를 추출
  const  searchParams  = useSearchParams();
  const page: string = searchParams.get('page') || '1';


  const fetchLikes = async() => {

    const {data} = await axios(`/api/likes?limit=10&page=${page}`);
    return data as LikeApiResponse

  }

  const { data: likes, isFetching, isLoading , isSuccess, refetch} = useQuery({
    queryKey: [`likes-${page}`], //page 번호를 넣지 않으면 캐시된 쿼리가 계속 호출된다.
    queryFn: () => fetchLikes(),
  });

  return (
    <div className='px-4 md:max-w-5xl mx-auto py-8'>
      <h3 className='text-lg font-semibold'>찜한 맛집</h3>
      <div className='mt-1 text-gray-500 text-sm'>찜한 가게 리스트입니다.</div>

      <ul className='mt-10'>
        {isLoading ? (
          <Loading />
        ) : (
          likes?.data.map((like: LikeInterface, index) => {
            if (like.store) { //like.store가 있을 떄만 처리
              return <StoreListSub key={index} i={index} store={like.store} />;
            }
          })
        )}
      </ul>
      {
        likes?.totalPage && likes?.totalPage > 0 && 
        <Pagination 
          total={likes?.totalPage}
          page={page}
          pathname={"/users/likes"}
        />
      }
    
      {/* <div className='w-full touch-none h-10 mb-1' ref={ref} /> */}
    </div>
  )
}

export default LikesPage