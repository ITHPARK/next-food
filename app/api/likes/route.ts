
import prisma from "../../../db";

//api응답 생성 모듈
import { NextResponse, NextRequest } from 'next/server';
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/authOptions";

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

