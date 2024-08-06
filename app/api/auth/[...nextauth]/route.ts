import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
// 필요에 따라 Provider를 추가할 수 있습니다.


const prisma = new PrismaClient();

const handler = NextAuth({
  //provider를 추가하여 sso 인증을 사용하도록 설정
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
  adapter: PrismaAdapter(prisma), //NextAuth가 prisma와 상호작용을 위한 설정
  secret: process.env.NEXTAUTH_SECRET, //세션 및 토큰 암호화를 위해 사용된다
  pages: {
    signIn: "/users/login",
  },
  debug: true, // 디버깅 활성화
  events: {
    signIn: async (message) => {
      console.log("User signed in:", message);
    },
    signOut: async (message) => {
      console.log("User signed out:", message);
    },
  },
});

//GET과 POST HTTP 메서드로 내보낸다
export { handler as GET, handler as POST };
