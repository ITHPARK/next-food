"use client"

import React, {useCallback} from 'react'
import { AiFillHeart  } from "@react-icons/all-files/ai/AiFillHeart";
import { AiOutlineHeart } from "@react-icons/all-files/ai/AiOutlineHeart";
import {StoreType} from "../types/types"
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {LikeProps} from "../types/types";
import { useSession } from 'next-auth/react';
import {toast} from "react-toastify";


const Like = ({storeId}: LikeProps) => {

        const stringStoreId = storeId.toString();
        const {data: session, status} = useSession(); 

        const fetchStore = async (id: string) => {
            const response = await axios(`/api/stores?id=${storeId}`);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.data as StoreType;
        };
    
        const { data, refetch} = useQuery<StoreType>({
            queryKey: [`like-store-${storeId}`],
            queryFn: () => fetchStore(stringStoreId),
            enabled: !!storeId, // id가 있을 때만 쿼리 실행
            refetchOnWindowFocus: false, // 창을 바꿀때마다 새로고침 되는걸 막는다
        });
    

    
        const toggleLike = useCallback(async () => {
            if (session?.user && data) {
                try {
                    const like = await axios.post("/api/likes", {
                        storeId: data.id,
                    });
                    console.log(like);
                    if (like.data.status === 201) {
                        toast.success("가게를 찜했습니다.");
                    } else {
                        toast.warn("찜을 취소했습니다.");
                    }
    
                    // like 업데이트를 위한 refetch
                    refetch();
                } catch (error) {
                    console.log(error);
                }
            } else if (status === "unauthenticated") {
                toast.warn("로그인 후 이용해 주세요");
            }
        }, [session?.user, data, refetch, status]);


    return (
        <div>
            <button type='button' onClick={toggleLike}>
                {/* 로그인 한 사용자가 좋아요를 눌렀을 때 */}
                {
                    status === "authenticated" && data?.likes?.length ? (
                        
                        <AiFillHeart className='hover:text-red-600 focus:-red-600 text-red-500'/>
                    ) :
                    (
                        <AiOutlineHeart/>
                    )
                }
            </button>   
        </div>
        
        
    )
}

export default Like
