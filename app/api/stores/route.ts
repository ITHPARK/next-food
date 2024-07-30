// app/api/stores/route.ts

import { PrismaClient } from '@prisma/client';


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
        const prisma = new PrismaClient();
        const stores = await prisma.store.findMany({});
        console.log('Prisma Stores Data:', stores);
        
        return NextResponse.json(stores);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '서버에러' }, { status: 500 });
    }
}