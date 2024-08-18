
# :pushpin: NEXT.JS로 만든 맛집 앱
>[ Project URL ] : [https://www.next-food-map.shop](https://www.next-food-map.shop)
> 

</br>

## 1. 프로젝트 소개
해당 앱은 맛집의 위치와 상세 정보를 제공하는 앱으로써 카카오지도 API 통해 음식점의 위치를 지도에서 확인이 가능하며 음식점에 대한 상세 정보와 댓글을 확인 할 수 있으며, 구글, 네이버, 카카오 로그인을 지원하고 로그인 시 맛집 추가, 수정, 삭제, 댓글달기, 찜하기 기능을 지원합니다.

</br>

## 2. 사용 기술
#### `Front-end`
  - Next.js
  - Typescript
  - Tainwind CSS
  - Recoil
  - React Query v4
#### `Other`
  - 스키마 구성 -> Prisma
  - 데이터 베이스 -> Supabase

</br>

## 3. 주요 구현 목록
- [prisma를 이용한 유저정보, 식당정보, 계정, 로그인 세션, 토큰, 좋아요, 댓글 스키마를 정의 및 supabase로 연동해 데이터베이스 구현.](#Prisma-스키마-구성)
- [스카마와 데이터베이스를 바탕으로 클라이언트측에서 NextRoute를 기능별 route를 구성하여 CRUD 구현.](#클라이언트-측-CRUD-Route-구현)
- [NextAuth로 구글, 네이버, 카카오 로그인 구현 및 jwt 토큰으로 세션정보를 받거나 서버와 통신.](#NextAuth으로-로그인-구현)
- [카카오지도API를 사용해 각 식당의 위치를 지도에 표시 및 클릭시 팝업을 뛰워 간략한 정보를 제공 및 상세페이지 링크 이동 가능.](#카카오지도API로-식당-위치-구현)
- [맛집 리스트 페이지 구현 및 식당이름 검색 기능과 지역별 식당 리스트 검색 가능.](#식당-리스트와-식당-이름-검색과-지역별-필터-적용-구현-(Recoil-상태-값으로-React-Query-쿼리키로-데이터-페칭))
- [로그인 시 식당 리스트 댓글달기, 및 DaumPostCode로 주소검색하여 맛집 등록기능, 찜하기, 맛집 수정, 삭제 기능 구현.](#댓글달기,-찜-등-부가적-기능-구현)

<br/>

## 4. 주요 소스코드

### Prisma 스키마 구성
[목록으로](#3-주요-구현-목록)

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  likes         Like[]
  comments     Comment[]
}

model Store {
  id        Int      @id @default(autoincrement())
  phone     String?  // tel_no
  address   String?  // rdn_code_nm
  lat       String?  // y_dnts
  lng       String?  // x_cnts
  name      String?  // upso_nm
  category  String?  // bizcnd_code_nm
  storeType String?  // cob_code_nm
  foodCertifyName String? // crtfc_gbn_nm
  likes         Like[]
  comments     Comment[]
}


model Account {
  id                 String  @id @default(cuid())
  userId             Int  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  refresh_token_expires_in Int?
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
 
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       Int   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@map("sessions")
}
 
 
model VerificationToken {
  identifier String
  token      String
  expires    DateTime
 
  @@unique([identifier, token])
  @@map("verificationtokens")
}

model Like {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  storeId   Int
  userId    Int
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, storeId])
}


model Comment {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  storeId   Int
  userId    Int
  body String
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, storeId])
}

```
</br>

### 클라이언트 측 CRUD Route 구현
[목록으로](#3-주요-구현-목록)
#### auth/comments.ts (댓글 기능 구현 댓글 생성, 삭제, 가져오기 및 페이징 구현 )
```
import prisma from "../../../db";

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";




export const POST = async(req: NextRequest) => {// 댓글 추가로직
    try{
        const session = await getServerSession(authOptions);

        if(!session?.user) {
            return NextResponse.json({status: 401}); //유저 정보가 없을떄 처리
        }

        const bodyData = await req.json();
        const{storeId, body}: {storeId: number, body: string} = bodyData;

        console.log(bodyData);
        const comment = await prisma.comment.create({
            data: {
                storeId,
                body,
                userId: session?.user.id,
            }
        })

        return NextResponse.json({comment, status: 200}); 

    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}

export const DELETE = async(req: NextRequest) => {
    try{
        const id : string = req.nextUrl.searchParams.get('id') || ""; 
        const session = await getServerSession(authOptions);
        
        if(!session?.user || !id){
            return NextResponse.json({status: 401});
        }

        const result = await prisma.comment.delete({
            where: {
                id: parseInt(id),
            }
        });

        return NextResponse.json(result, {status: 200});

    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}


export const GET = async(req: NextRequest) => {
    try{

        const page : string = req.nextUrl.searchParams.get('page') || "1"; 
        const limit : string = req.nextUrl.searchParams.get('limit') || "10"; 
        const storeId: number = parseInt(req.nextUrl.searchParams.get('storeId') || '0', 10);
        const user: boolean = req.nextUrl.searchParams.get('user') === 'true' || false;

        const skipPage = parseInt(page) - 1;
        const session = await getServerSession(authOptions);

        


        //댓글 가져오기
        const count = await prisma.comment.count({
            where: {
                storeId: storeId ? storeId : {},
                userId : user ? session?.user.id: {} //유정정보가 있으면 해당 유저의 댓글을 가져오고 아니면 모든 댓글을 가져옴
            },
        })

        const comments = await prisma.comment.findMany({
            orderBy: {createdAt: "desc"},
            where: {
                storeId: storeId ? storeId : {},
                userId : user ? session?.user.id: {} //유정정보가 있으면 해당 유저의 댓글을 가져옴
            },
            skip: skipPage* parseInt(limit), //예를 들어 2페이지라면 skipPage(현재 페이지 - 1) 1 * 10으로 10개의 데이터를 띄고 출력한다.
            take: parseInt(limit),
            include: { //user값을 포함시킴
                user: true,
                store:true,//내가 쓴 댓글이 어느 식당에 쓴건지 확인 하기위해서 정보 추가
            }
        });

        return NextResponse.json({
            data: comments,
            page: parseInt(page),
            totalPage: Math.ceil(count / parseInt(limit)),
        }, {status: 200});

    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}
```
#### likes/route.ts (찜하기 기능 구현)
```
import prisma from "../../../db";

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";


//데이터가 프로젝트에 json 파일로 있을 때 
// export async function GET() {

//     //process.cwd() = 루트 경로
//     const filePath = path.join(process.cwd(), 'data', 'map_data.json');

//     //파일을 utf-8인코딩으로 읽어 문자열로 변환
//     const fileData = fs.readFileSync(filePath, 'utf-8');

//     //json 문자열을 js 객체로 변환
//     const jsonData = JSON.parse(fileData);

//     //stores에 jsonData.DATA 저장
//     const stores: StoreType[] = jsonData.DATA;

//     //api응답
//     return NextResponse.json(stores);
    
// }


// API 핸들러
export const POST = async(req: NextRequest) => {
    try{
        const session = await getServerSession(authOptions);

        //바디를 json 형식으로 파싱
        const body = await req.json();

        const{storeId}: {storeId: number} = body;

        if(!session?.user) {
            return NextResponse.json({status: 401}); //유저 정보가 없을떄 처리
        }

        //Like데이터가 있는지 확인
        let like = await prisma.like.findFirst({
            where: {
                storeId,
                userId: session?.user?.id,
            }
        });

        //이미 찜을 했다면, 해당 like 데이터 삭제, 아니면 생성
        if(like){
            //이미 찜을 한 상황
            like = await prisma.like.delete({
                where: {
                    id: like.id,
                },
            });

            return NextResponse.json({like, status: 204}); 
        }else {
            //찜을 하지 않은 상황
            like = await prisma.like.create({
                data: {
                    storeId,
                    userId: session?.user?.id,
                },
            });

            return NextResponse.json({like, status: 201}); 
        }


    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}




export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
    
        const { searchParams } = new URL(req.url);
    
        // page와 limit을 숫자로 변환
        const page: number = parseInt(searchParams.get('page') || '1', 10);
        const limit: number = parseInt(searchParams.get('limit') || '10', 10);
    
        // count 값을 가져오면서 await 사용
        const count: number = await prisma.like.count({
            where: {
            userId: session.user.id,
            },
        });
    
        // page와 limit을 바탕으로 skip 값 계산
        const skipPage = page > 0 ? (page - 1) * limit : 0;
    
        const likes = await prisma.like.findMany({
            orderBy: { createdAt: 'desc' },
            where: {
                userId: session.user.id,
            },
                include: {
                store: true,
            },
                skip: skipPage,
                take: limit,
            });
    
        return NextResponse.json({
            data: likes,
            page: page,
            totalPage: Math.ceil(count / limit),
            status: 200,
        });
    
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
    };
```
#### stores/route.ts (가게 리스트 생성, 수정, 삭제 구현)
```
// app/api/stores/route.ts

import prisma from "../../../db";

import {StoreApiResponse} from "../../../types/types"

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';

//json파일을 읽기 위한 모듈
import fs from 'fs';

//경로를 다루기 위한 모듈
import path from 'path';

import { StoreType } from '../../../types/types';
import axios from "axios";

import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";


//데이터가 프로젝트에 json 파일로 있을 때 
// export async function GET() {

//     //process.cwd() = 루트 경로
//     const filePath = path.join(process.cwd(), 'data', 'map_data.json');

//     //파일을 utf-8인코딩으로 읽어 문자열로 변환
//     const fileData = fs.readFileSync(filePath, 'utf-8');

//     //json 문자열을 js 객체로 변환
//     const jsonData = JSON.parse(fileData);

//     //stores에 jsonData.DATA 저장
//     const stores: StoreType[] = jsonData.DATA;

//     //api응답
//     return NextResponse.json(stores);
    
// }


// API 핸들러
export async function GET(req: NextRequest) {
    try {  

        //req 요청 쿼리를 받아온다.
        const id = req.nextUrl.searchParams.get("id") as string;
        const page = req.nextUrl.searchParams.get('page') as string; //쿼리 파라미터 처리
        const q = req.nextUrl.searchParams.get('q') as string;
        const district = req.nextUrl.searchParams.get('district') as string;
        
        const session = await getServerSession(authOptions);

        //GET 요청 처리
        if(page) {

            const pageSize = 10;  // 페이지당 항목 수
            const pageNum = parseInt(page, 10); //string 문자열을 10진 정수로 변환
            const count = await prisma.store.count();
            const stores = await prisma.store.findMany({
                orderBy: {id: "asc"}, //id 순서대로 정렬
                where: {
                    name: q ? {contains: q} : {}, //q가 있으면 q가 포함된 모든 레코드 노출
                    address: district ? {contains: district} : {}//district가 있으면 district가 포함된 모든 레코드 노출
                },
                skip: (pageNum - 1)  * pageSize, // 쿼리 결과에서 건너뛸 레코드 수 3페이지면 20개의 레코드를 스킵 즉 2페이지까지 스킵한다는 소리.
                take: 10,
            });
    
            const res: StoreApiResponse  = {
                page: parseInt(page),
                data: stores,
                totalCount: count,
                totalPage: Math.ceil(count / pageSize)
            }
            return NextResponse.json(res);     
        }else {

            const stores = await prisma.store.findMany({
                orderBy: {id: 'asc'},
                where: {id: id ? parseInt(id): {}}, //where문이 있으면 실행 아니면 무시
                include: { //store과 관련된 다른 모델(likes)의 데이터를 포함시킴
                    likes: { 
                        where: session ? {userId: session.user.id} : {},
                    },
                }
            });  
            
            return NextResponse.json(id ? stores[0] : stores);     
            
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '서버에러' }, { status: 500 });
    }
}


export const POST = async(req: NextRequest) => {
    try{
        
        const formData = await req.json(); //post 요청 추가값

        //주소로 좌표값을 받아오기위한 작업
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        }
        
        //쿼리 값(주소)를 UTF-8로 인코딩하여 get 요청을 보낸다.
        const {data} = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
            formData.address
        )}`,
        {headers}
        );

        const result = await prisma.store.create({ 
            data: {...formData, lat: data.documents[0].y, lng: data.documents[0].x},
        })

        return NextResponse.json(result);
    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}

export const PUT = async(req: NextRequest) => { //데이터 변경
    try{
        const formData = await req.json(); //put 요청 추가값

        //주소로 좌표값을 받아오기위한 작업
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        }
        
        //쿼리 값(주소)를 UTF-8로 인코딩하여 get 요청을 보낸다.
        const {data} = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
            formData.address
        )}`,
        {headers}
        );

        const result = await prisma.store.update({ 
            where: {id: formData.id},
            data: {...formData, lat: data.documents[0].y, lng: data.documents[0].x},
        })

        return NextResponse.json(result);

    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}


export const DELETE = async(req: NextRequest) => { //데이터 삭제
    try{
        const id = req.nextUrl.searchParams.get("id");
        console.log(id);

        if(id) {
            const result = await prisma.store.delete({
                where: {
                    id: parseInt(id),
                },
            });

            return NextResponse.json(result, {status: 200});
        }

        return NextResponse.json(null ,{status: 500});
        
        
        
    }catch(error) {
        return NextResponse.json(error, {status: 500});
    }
}
```
### NextAuth으로 로그인 구현
[목록으로](#3-주요-구현-목록)
#### auth/options.ts 
```
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../../db";


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt", 
        maxAge: 60 * 60 * 24, //초단위로 24시간 유지
        updateAge: 60 * 60 * 2, //초단위로 2시간 유지
    },
    adapter: PrismaAdapter(prisma), //NextAuth가 prisma와 상호작용을 위한 설정
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || "",
            clientSecret: process.env.NAVER_CLIENT_SECRET || ""
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET || ""
        })
    ],
    pages: {
        signIn: "/users/login",
    },
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
            ...session.user,
            id: token.sub,
            },
        }),
        jwt: async ({ user, token }) => {
            if (user) {//현재 세션 데이터를 받아서 객체를 확장시키고 token.sub(사용자의 id)를 session.user.id에 추가한다.
                token.sub = user.id;
            }
            return token;
        },
    },
};
```
#### auth/route.ts
```
import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../../db";
import {authOptions} from "./options"

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```
#### login/page.tsx
```
"use client"

import {useEffect} from "react";
import React from 'react'
import { AiOutlineGoogle } from "react-icons/ai";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
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
```
### 카카오지도API로 식당 위치 구현 
[목록으로](#3-주요-구현-목록)
#### MapMarkerCmp.tsx (리액트 쿼리로 데이터 페칭)
```
"use client"

import React, {useState} from 'react'
import Map from "./Map";
import Markers from "./Markers";
import StoreBox from "./StoreBox";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import Loading from "./Loading";
import CurrentLocation from "./CurrentLocation";


//컴포넌트가 생성 될때 마다 함수가 새로 생성되는걸 방지해서 밖에 작성
const fetchStores = async () => {
  try {
    const { data } = await axios.get("/api/stores");
    return data;
  } catch (error) {
    console.error('Error fetching stores:', error);  // 오류 로그 추가
    throw error;
  }
};


const MapMarkerCmp = () => {

    const [map, setMap] = useState(null);
    const [currentStore, setcurrentStore] = useState(null);

    const { data: stores, isError, isLoading } = useQuery({
      queryKey: ["stores"],
      queryFn: fetchStores,
    });

  if (isLoading) return <Loading/>;
  if (isError) return <div className='w-full h-screen mx-auto pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;


  return (
    <div>
        <Map/>
        <Markers storeDatas={stores} setcurrentStore={setcurrentStore}/>
        <StoreBox/>
        <CurrentLocation/>
    </div>
  )
}

export default MapMarkerCmp
```
#### Map.tsx (카카오 지도 노출 컴포넌트)
```
/*global kakao */
"use client";

import React, { useEffect } from 'react';
import Script from "next/script";
import {MapProps} from "../types/types";
import {useRecoilState, useRecoilValue} from 'recoil';
import {mapState, locationState} from "../atom";

//declare로 전역 타입 선언
declare global {
    interface Window {
      kakao: any;
    }
};

const Map = ({lat, lng, zoom}: MapProps) => {

    const [map, setMap] = useRecoilState(mapState); 
    const location = useRecoilValue(locationState);


  const loadKakaoMap = () => {
    
    // 지도 로드
    window.kakao.maps.load(() => {
      // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(lat ?? location.lat, lng ??  location.lng), // 지도 중심좌표
        level: zoom ?? location.zoom, // 지도의 확대 레벨
      }
      //맵 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      setMap(map);
    });
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }
  }, []);

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        onLoad={loadKakaoMap}
      />
      <div id="map" className="w-full h-screen"></div>
    </div>
  );
}

export default Map;
```



#### Markers.tsx (맛집 지도 마커 컴포넌트)

```
"use client"

import React, {useEffect, useCallback} from 'react'
import {MarkersProps} from "../types/types";
import {useRecoilValue, useRecoilState} from "recoil"
import {mapState, currentStoreState, locationState} from "../atom"

const Makers = ({ storeDatas = []}: MarkersProps) => { // 기본값 빈 배열 설정

    const map = useRecoilValue(mapState);
    const [currentStore, setCurrentStore] = useRecoilState(currentStoreState);
    const [location, setLocation] = useRecoilState(locationState)

    const loadKakaoMarkers = useCallback(() => {

        if(map && Array.isArray(storeDatas)) { // 배열인지 확인
            //식당 데이터 마커 띄우기 
            storeDatas.map((store: any) => {
                //마커 이미지 커스텀
                const imageSrc = store?.category ? `/images/markers/${store?.category}.png` :  `/images/markers/default.png`
                const imageSize = new window.kakao.maps.Size(40, 40);
                const imageOption = {offset: new window.kakao.maps.Point(27, 69)};

                const markerImage = new window.kakao.maps.MarkerImage(
                    imageSrc,
                    imageSize,
                    imageOption
                )
                
                const markerposition = new window.kakao.maps.LatLng(
                    store?.lat,
                    store?.lng
                );

                const marker = new window.kakao.maps.Marker({
                    position: markerposition,
                    image: markerImage
                });

                //marker를 map에 띄움
                marker.setMap(map);

                //마커 커서가 호버되었을 때 마커 위에 표시할 인포윈도우
                const content = `<div class="infowindow">${store?.name}</div>`; //인포윈도우에 표시될 내용

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
                    setCurrentStore(store)
                    setLocation({
                        ...location,
                        lat: store.lat,
                        lng: store.lng,
                        
                    })
                })
            });
        }
        //map, storeDatas, setcurrentStore 값이 변경될 때 새로운 콜백을 실행
    },[map, storeDatas, setCurrentStore])

    useEffect(() => {
        loadKakaoMarkers();
    }, [map, loadKakaoMarkers])

    return (
        <></>
    )
}

export default Makers
```
### 식당 리스트와 식당 이름 검색과 지역별 필터 적용 구현 (Recoil 상태 값으로 React Query 쿼리키로 데이터 페칭)
[목록으로](#3-주요-구현-목록)

#### StoreList.tsx
```
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
```
#### SearchFilter.tsx
```
"use client"

import React from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { DISTRICT_ARR } from '../data/store';
import { searchState } from '../atom';
import {useRecoilState} from "recoil"


const SearchFilter = () => {

    const [search, setSearch] = useRecoilState(searchState);

  return (
    <div className='flex flex-col md:flex-row gap-2 my-4'>
        <div className='flex items-center justify-center gap-2 w-full'>
        <AiOutlineSearch className='w-6 h-6' />
        <input 
            type="search" 
            onChange={(e) => setSearch({...search, q: e.target.value})}
            placeholder="음식점 검색" 
            className='block w-full p-3 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  outline-none'
        />
        </div>
        <select onChange={(e) => setSearch({...search, q: e.target.value})} className='bg-gray-50 border border-gray-300 text-gray-800 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 block w-full p-3 outline-none'>
            <option>지역 선택</option>

            {
                DISTRICT_ARR.map((data)=> {
                    return <option value={data} key={data}>{data}</option>
                })
            }
        </select>
    </div>
  )
}

export default SearchFilter
```
### 댓글달기, 찜 등 부가적 기능 구현
[목록으로](#3-주요-구현-목록)
#### CommentForm.tsx (textarea값을 post 요청으로 데이터베이스에 추가)
```
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
```
#### CommentList.tsx (GET 요청으로 댓글 데이터를 가져와 리스트업)
```
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
```
#### stores/[id]/page.tsx (useForm으로 input 데이터를 받아 기존 데이터베이스에 있던 맛집 데이터 수정 )
```
"use client"

import {useEffect} from "react"
import { useForm } from "react-hook-form";
import { CATEGORY_ARR, FOOD_CERTIFY_ARR, STORE_TYPE_ARR } from "../../../../data/store";
import {toast} from "react-toastify";
import axios from "axios";
import AddressSearch from '../../../../components/AddressSearch'
import { StoreType } from "../../../../types/types";
import { useRouter } from 'next/navigation';
import {useQuery} from "@tanstack/react-query";
import Loading from "../../../../components/Loading";


//params는 App Router에서 자동으로 전달해주는 props
const StoreEditPage = ({ params }: { params: { id: string } }) => {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreType>();

  const router = useRouter();
  const id = params.id;

  const fetchStore = async (id: string) => {
    const response = await axios(`/api/stores?id=${id}`);
    if (!response) {
      throw new Error('Network response was not ok');
    }
    return response.data as StoreType;
  };

  const { data, isError, isLoading , isSuccess} = useQuery({
    queryKey: [`store-${id}`],
    queryFn: () => fetchStore(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    refetchOnWindowFocus: false, // 창을 바꿀때마다 새로고침 되는걸 막는다
  });

  useEffect(() => {
    if(isSuccess) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("phone", data.phone || "번호정보 없음");
      setValue("lat", data.lat);
      setValue("lng", data.lng);
      setValue("address", data.address);
      setValue("foodCertifyName", data.foodCertifyName);
      setValue("storeType", data.storeType);
      setValue("category", data.category || "업종구분 없음");
    }
  },[isSuccess, data])

  if (isError) return <div className='w-full h-screen mx-auto  pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;

  if(isLoading) return <Loading/>



  return (
    <form className='px-4 md:max-w-4xl mx-auto py-8' 
      onSubmit={handleSubmit(async (data) => {

        try {
          const result = await axios.put("/api/stores", data);
          
          if(result.status === 200){
            //데이터 추가 성공
            toast.success("수정을 완료했습니다.");
          }else {
            //데이터 추가 실패
            toast.error("다시 시도해주세요.");
          }
        }catch (error) {
          console.log(error);
          toast.error("다시 시도해주세요.");
        }
      })}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">맛집 수정</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">아래 내용을 입력해서 맛집을 등록해주세요</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                가게명
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("name", {required: true})}
                  placeholder="가게명 입력"
                  className="block w-full rounded-md border-0 p-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors?.name?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                카테고리
              </label>
              <div className="mt-2">
                <select {...register("category", {required: true})} className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <option value="">카테고리 선택</option>
                  {
                    CATEGORY_ARR?.map( category => 
                    <option key={category} value={category}>{category}</option>)
                  }
                </select>
                {errors?.category?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                연락처
              </label>
              <div className="mt-2">
                <input
                  {...register("phone", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors?.phone?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>


            <AddressSearch register={register} setValue={setValue} errors={errors} />

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="foodCertifyName" className="block text-sm font-medium leading-6 text-gray-900">
                식품인증구분
              </label>
              <div className="mt-2">
                <select
                  {...register("foodCertifyName", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <option value="">식품인증구분 선택</option>
                  {FOOD_CERTIFY_ARR?.map(data => <option key={data} value={data}>{data}</option>)}
                </select>
                {errors?.phone?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="storeType" className="block text-sm font-medium leading-6 text-gray-900">
                업종구분
              </label>
              <div className="mt-2">
                <select
                  {...register("storeType", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  
                  {data?.category ? (<option value="업종구분 없음" selected>업종구분 없음</option>) :
                  <>
                    <option value="">식품인증구분 선택</option>
                    {STORE_TYPE_ARR?.map(data => <option key={data} value={data}>{data}</option>)}
                  </>
                  }
                </select>
                  {errors?.phone?.type === 'required' && (
                    <div className="pt-2 text-xs text-red-600">
                      필수  입력사항입니다.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.back() }
        >
          뒤로가기
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          수정하기
        </button>
      </div>
    </form>
  )
}

export default StoreEditPage
```




  

  



