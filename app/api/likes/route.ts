// app/api/stores/route.ts

import prisma from "../../../db";

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';
import { StoreType } from '../../../types/types';
import axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/route";

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

