import React from 'react'
import {useSession} from "next-auth/react";
import {CommnetListProps} from "../../types/types"
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";


const CommentList = ({ comments, displayStore, refetch }: CommnetListProps & { refetch: () => void }) => {

    const {data: session} = useSession();

    const handleDeleteComment = async(id: number) => {
        const confirm = window.confirm("해당 댓글을 삭제하시겠습니까?");

        if(confirm) {
            try {
                const result = await axios.delete(`/api/comments?id=${id}`);

                if(result.status === 200) {
                    toast.success('댓글을 삭제했습니다.');
                    refetch(); // 댓글 삭제 후 데이터를 다시 가져옴
                } else {
                    toast.error("다시 시도해 주세요");
                }
            }catch (error){
                toast.error("다시 시도해 주세요");
            }
        }
    }

    
    return (
            <div className='my-10'>
            {
            comments?.data && comments?.data?.length > 0 ? (
                comments?.data.map((comment) => {
                return (
                    <div key={comment.id} className='flex items-center space-x-4 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8'>
                    <div>
                        <img 
                        src={comment?.user?.image || '/images/markers/default.png'} 
                        alt="프로필 이미지" 
                        width={40}
                        height={40}
                        className='rounded-full bg-gray-10'  
                        />
                    </div>
                    <div className='flex flex-col space-y-1 flex-1'>
                        <div>{comment?.user?.name ?? "사용자"} | {comment?.user?.email}</div>
                        <div className='text-xs'>{new Date(comment?.createdAt)?.toLocaleDateString()}</div>
                        <div className='text-black mt-1 text-base'>{comment.body}</div>
                        {displayStore && (
                            <div className='mt-2'>
                                <Link href={`/stores/${comment?.store?.id}`}
                                    className='text-blue-700 hover:text-blue-600 underline font-medium'
                                >
                                    {comment?.store?.name}
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        {comment.userId === session?.user.id && (
                        (
                            <button type="button" className='underline text-gray-500 hover:text-gray-400'
                                onClick={() => handleDeleteComment(comment.id)}
                            >삭제</button>
                        )
                        )}
                    </div>
                    </div>
                )
                })
            )
            :
            (
                <div className='p-4 border border-gray-200 rounded-md text-sm text-gray-400 '>
                댓글이 없습니다.
                </div>
            )
            }
        </div>
    )
    }

export default CommentList
