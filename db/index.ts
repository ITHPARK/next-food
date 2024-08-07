import { PrismaClient } from '@prisma/client'

//새로운 인스턴스 반환
const prismaClientSingleton = () => {
  return new PrismaClient()
}

//globalThis 객체의 타입에 prismaGlobal 속성을 추가
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

//globalThis.prismaGlobal이 존재하면 이를 사용하고, 존재하지 않으면 새로운 PrismaClient 인스턴스를 생성
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

//개발 환경에서 매 요청마다 새로운 인스턴스를 생성하는 대신, 하나의 인스턴스를 재사용
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma