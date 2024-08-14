import React from 'react'
import { CommentProps } from '../../types/types'
import {useForm} from "react-hook-form";
import axios from "axios";
import {useSession} from "next-auth/react";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CommentForm = ({storeId, refetch}: CommentProps & { refetch: () => void }) => {

    const {status} = useSession();
    const { register, handleSubmit, resetField, formState:{errors} } = useForm();


    return (
        <form onSubmit={handleSubmit(async (data) => {

            const result = await axios.post("/api/comments", {
            ...data,
            storeId,
            })
            
            if(result.status === 200) {
            toast.success("댓글을 등록했습니다.");
            resetField("body") //바디값을 리셋시킨다.
            refetch();
            }else {
            toast.error("다시 시도해주세요");
            }

        })}
            className='flex flex-col space-y-4'
        >
            {errors?.body?.type === "required" && (
            <div className='text-xs text-red-600'>필수 입력사항입니다</div>
            )}
            <textarea 
            {...register('body', { required: true })}
            rows={3} 
            placeholder='댓글을 작성해주세요...'
            className='block w-full min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 text-black placeholder:text-gray-400 text-sm leading-6'
            />
            <button type='submit' className='bg-blue-600 hober:bg=blue-500 text-white px-4 py-2 text-sm fonst-semibold shadow-sm float-right mt-2 rounded-md'>작성하기</button>
        </form>
    )
    }

export default CommentForm
