"use client"

import {useEffect} from "react";
import React from 'react'
import { AiOutlineGoogle } from "@react-icons/all-files/ai/AiOutlineGoogle";
import { SiNaver } from "react-icons/si"; 
import { RiKakaoTalkFill } from "@react-icons/all-files/ri/RiKakaoTalkFill";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(status === "authenticated"){
      router.push("/");
    }
  }, [router, status]);
  
  return (
    <div className=' flex flex-col justify-center px-6 lg:px-8 h-[60vh]'>
      <div className='mx-auto w-full max-w-sm'>
        <h1 className='text-blue-800 text-center text-2xl font-semibold italic'>Nextmap</h1>
        <div className='text-center mt-6 text-2xl font-bold text-gray-600'>SNS 계정으로 로그인해주세요</div>
        <p className='mt-2 text-center text-sm text-gray-600'>계정이 없다면 자동으로 회원가입이 진행됩니다.</p>
      </div>
      <div className='mt-10 mx-auto w-full max-w-sm'>
        <div className='flex flex-col gap-3'>
          <button 
            type="button"
            className='text-white flex gap-3 bg-[#4285F4] hover:bg-[#4285F4]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center'
            onClick={() => signIn("google", {callbackUrl: "/"})}
          >
            <AiOutlineGoogle className='w-6 h-6'/>
            Sign in whit Google
          </button>
          <button 
            type="button" 
            className='text-white flex gap-3 bg-[#2db400] hover:bg-[#2db400]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center'
            onClick={() => signIn("naver", {callbackUrl: "/"}) }
          >
            <SiNaver  className='w-4 h-4'/>
            Sign in whit Naver
          </button>
          <button 
            type="button" 
            className='text-black flex gap-3 bg-[#fef01b] hover:bg-[#fef01b]/90 font-medium rounded-lg w-full px-5 py-4 text-center items-center justify-center'
            onClick={() => signIn("kakao", {callbackUrl: "/"})}
          >
            <RiKakaoTalkFill  className='w-6 h-6'/>
            Sign in whit Kakao
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage