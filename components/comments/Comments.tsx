"use client"

import React from 'react'
import { CommentProps } from '../../types/types'
import {useSession} from "next-auth/react";
import CommentForm from './CommentForm';
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {CommnetApiResponse} from "../../types/types";
import { useSearchParams } from 'next/navigation';
import CommentList from "./CommentList";
import Pagination from "../Pagination";




const Comments = ({storeId}: CommentProps) => {
  const {status, data: session} = useSession();

  // URL 쿼리 파라미터 접근
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1'; 

  const fetchComments = async() => {
    const {data} = await axios(`/api/comments?storeId=${storeId}&limit=10&page=${page}`) 
    return data as CommnetApiResponse
  }

  const { data: comments, isFetching, isLoading , isSuccess, refetch} = useQuery({
    queryKey: [`comments-${storeId}-${page}`], 
    queryFn: () => fetchComments(),
  });

  return (
    <div className='md:max-w-2xl py-8 px-2 mb-20 mx-auto'>
      {status === "authenticated" &&
        <CommentForm storeId={storeId} refetch={refetch}/>
      }
      <CommentList comments={comments} displayStore={true} refetch={refetch}/>
      <Pagination total={comments?.totalPage} page={page} pathname={`/stores/${storeId}`}/>
      
    </div>
  )
}

export default Comments
