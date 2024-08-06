// app/api/stores/route.ts

import { PrismaClient } from '@prisma/client';

import {StoreApiResponse} from "../../../types/types"

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';

//json파일을 읽기 위한 모듈
import fs from 'fs';

//경로를 다루기 위한 모듈
import path from 'path';

import { StoreType } from '../../../types/types';


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
        //prisma supabase에 연결
        const prisma = new PrismaClient();

        //req 요청 쿼리를 받아온다.
        const id = req.nextUrl.searchParams.get("id");
        const page = req.nextUrl.searchParams.get('page'); //쿼리 파라미터 처리
        const q = req.nextUrl.searchParams.get('q');
        const district = req.nextUrl.searchParams.get('district');

        
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
            const stores : StoreType[] = await prisma.store.findMany({
                orderBy: {id: 'asc'},
                where: {id: id ? parseInt(id): {}}, //where문이 있으면 실행 아니면 무시
            })  ;   
            
            return NextResponse.json(id ? stores[0] : stores);     
        }
       

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '서버에러' }, { status: 500 });
    }
}