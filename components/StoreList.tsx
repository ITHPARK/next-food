"use client"

import React , { useEffect, useRef} from 'react'
import axios from "axios";
import { useInfiniteQuery } from '@tanstack/react-query';
import {StoreType} from '../types/types';
import Loading from '../components/Loading'
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import SearchFilter from "./SearchFilter";
import {useRecoilValue} from "recoil";
import {searchState} from "../atom"
import { useRouter } from 'next/navigation';
import StoreListSub from './StoreListSub';




const StoreList = () => {

    // const [storeData, setStoreData] = useState<StoreType[]>([]);
    // const [pagenation, setPagenation] = useState<number[]>([]);


    // 페이지 파라미터를 useMemo로 메모이제이션
    const ref = useRef<HTMLDivElement | null>(null);
    const pageRef = useIntersectionObserver(ref, {});
    const isPageEnd = !!pageRef?.isIntersecting;
    const router = useRouter();
    const searchvalue = useRecoilValue(searchState);

    const searchParam ={
      q: searchvalue?.q,
      district: searchvalue?.district
    }

    const fetchData = async ({pageParam = 1}) => {
      const {data} = await axios.get(`/api/stores?page=` + pageParam, {
        params: {
          limit: 10,
          page: pageParam, //요청할 페이지 번호
          ...searchParam//데이터 객체와 병합
        }
      });
    
      return data;
    }

    const {data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
      queryKey: ['stores', searchParam ], //쿼리를 고유하게 식별하는 키. searchParam가 변경 될 때마다 쿼리 다시 실행 
      queryFn: fetchData, //데이터를 가져오는 함수
      initialPageParam: 1, //initialPageParam: 첫 페이지의 초기 파라미터를 설정
      getNextPageParam: (lastPage: any) => { //lastPage에서 다음 페이지 파라미터를 계산
        return lastPage && lastPage.data && lastPage.data.length > 0 ? lastPage.page + 1 : undefined;
      },
    });


    //페이지의 끝에 도달하면 fetchNextPage를 호출
    useEffect(() => {
      if (isPageEnd) {
        fetchNextPage();
      }
    }, [fetchNextPage, isPageEnd]);  

  return (
    <>
      <SearchFilter/>
      <ul>
        {data?.pages.map((store, index) => (
          store?.data.map((store: StoreType, i: number ) => {
            return(
              <StoreListSub store={store} i={i} key={i}/>
            )
          }) 
        ))}
      </ul>
      {isFetching && hasNextPage && <Loading />}
      <div className='w-full touch-none h-10 mb-1' ref={ref} />
    </>
    
  )
}

export default StoreList