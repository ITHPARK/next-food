
import prisma from "../../../db";

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/route";



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