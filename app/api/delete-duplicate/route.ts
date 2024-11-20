import { PrismaClient } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    // 중복 레코드를 찾아 삭제하는 쿼리
    const stores = await prisma.store.findMany({
      where: {//조건
        address: {
          not: null,  // address가 null이 아닌 경우만
        },
      },
      select: {//선택
        id: true,
        address: true,
      },
    });

    // address별로 첫 번째 레코드를 제외한 다른 레코드들을 삭제
    // address가 같은 레코드들을 모은 후 첫 번째 레코드를 제외하고 삭제
    const seenAddresses = new Set();

    for (const store of stores) {
      // 같은 address를 가진 첫 번째 레코드는 그대로 두고, 그 이후의 중복된 레코드를 삭제
      if (!seenAddresses.has(store.address)) { //같은 address를 가지고 있지 않다면 set 객체에 레코드 추가
        seenAddresses.add(store.address);
      } else {
        // 중복된 address를 가진 레코드 삭제
        await prisma.store.delete({
          where: {
            id: store.id,
          },
        });
      }
    }

    // 중복 레코드 삭제 후 성공 메시지 반환
    return NextResponse.json({ message: 'Duplicate records deleted successfully', status: 200 });

  } catch (error: unknown) {
    // error가 Error 인스턴스인지 확인
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '오류가 발생하였습니다.' }, { status: 500 });
  }
};