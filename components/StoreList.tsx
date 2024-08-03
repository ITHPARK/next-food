"use client"

import React , {useState, useEffect, useMemo, useRef} from 'react'
import axios from "axios";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {StoreType} from '../types/types';
import Image from 'next/image';
import Loading from '../components/Loading'
import {StoreApiResponse} from "../types/types";
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import useIntersectionObserver from "../hooks/useIntersectionObserver";




const StoreList = () => {

    // const [storeData, setStoreData] = useState<StoreType[]>([]);
    // const [pagenation, setPagenation] = useState<number[]>([]);


    // 페이지 파라미터를 useMemo로 메모이제이션
    const ref = useRef<HTMLDivElement | null>(null);
    const pageRef = useIntersectionObserver(ref, {});
    const isPageEnd = !!pageRef?.isIntersecting;



    const fetchData = async ({pageParam = 1}) => {
      const {data} = await axios.get(`/api/stores?page=` + pageParam, {
        params: {
          limit: 10,
          page: pageParam, //요청할 페이지 번호
        }
      });
     
      return data;
    }

    const {data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
      queryKey: ['stores', 1 ], //쿼리를 고유하게 식별하는 키
      queryFn: fetchData, //데이터를 가져오는 함수
      initialPageParam: 1, //initialPageParam: 첫 페이지의 초기 파라미터를 설정
      getNextPageParam: (lastPage: any) => { //lastPage에서 다음 페이지 파라미터를 계산
        console.log(lastPage)
        return lastPage && lastPage.data && lastPage.data.length > 0 ? lastPage.page + 1 : undefined;
      },
    });


    //페이지의 끝에 도달하면 fetchNextPage를 호출
    useEffect(() => {
      if (isPageEnd) {
        fetchNextPage();
      }
    }, [fetchNextPage, isPageEnd]);



    // useEffect 훅을 사용하여 stores 데이터가 업데이트될 때 상태를 업데이트
    // useEffect(() => {
    //     // if (stores?.totalPage) {
         
    //     //   // 배열은 totalPage의 길이로 초기화 그리고 각 인스턴스의 index + 1 값을 넣어준다.
    //     //   // setPagenation([...Array(stores.totalPage)].map((_, index) => index + 1)); 
    //     // }
    // }, [data]);



  return (
    <>
      <ul>
        {data?.pages.map((store, index) => (
          store?.data.map((item: StoreType, ) => {
            return(
              <li key={`list${item.id}`} className='flex justify-between gap-x-6 py-5'>
                  <div className='flex gap-x-4'>
                    <Image 
                      src={item?.category? `/images/markers/${item?.category}.png`: "/images/markers/default.png"} 
                      width={48} 
                      height={48} 
                      alt='아이콘 이미지'>
                    </Image>  
                    <div>
                      <div className='text-sm font-semibold leading-6 text-gray-900'>
                        {item?.name}
                      </div>
                      <div className='mt-1 text-xs truncate font-semibold leading-5 text-gray-500'>
                        {item?.storeType}
                      </div>
                    </div>
                  </div> 
                  <div className='hidden sm:flex sm:flex-col sm:items-end'>
                     <div className='text-sm font-semibold leading-6 text-gray-900'>
                        {item?.address}
                      </div>
                      <div className='mt-1 text-xs truncate font-semibold leading-5 text-gray-500'>
                        {item?.phone || "번호 정보 없음"} | &nbsp;
                        { item?.foodCertifyName} | &nbsp;
                        { item?.category}
                      </div>
                  </div>
              </li>
          )
          }) 
        ))}
    </ul>
    {isFetching && hasNextPage && <Loading />}
    <div className='w-full touch-none h-10 mb-1' ref={ref} />

    
     {/* <div className='py-6 w-full px-10 flex justify-center flex-wrap gap-4 bg-white my-10 text-black'>
       {stores && stores.totalPage !== undefined && stores.totalPage <= 10 ? (
          pagenation.map((item, index) => {
            return(
              <Link href={{pathname: "/stores", query: {page: index + 1}}} key={index}>
                <span className={`px-3 py-2 rounded border shadow-sm bg-white ${item === parseInt(page, 10) ? " text-blue-600 font-bold" : "text-gray-300" }`}>{item}</span>
              </Link>
            )
        })
        )
        :
        (
          <>
            {
              Number(page) > 1 ? 
              <Link href={{pathname: "/stores", query: {page: Number(page) - 1}}}>
                <span className="px-3 py-2 rounded border shadow-sm bg-white" >이전</span>
              </Link>
              :
              ""
            }
            <Link href={{pathname: "/stores", query: {page: Number(page)}}}>
              <span className="px-3 py-2 rounded border shadow-sm bg-white text-blue-600" >{page}</span>
            </Link>

            {
              stores && stores.totalPage !== undefined && stores.totalPage > parseInt(page) &&
              <Link href={{pathname: "/stores", query: {page: Number(page) + 1}}}>
                <span className="px-3 py-2 rounded border shadow-sm bg-white" >다음</span>
              </Link>
            }
            
          </>
          
        )
           
        }
     </div> */}
    </>
    
  )
}

export default StoreList