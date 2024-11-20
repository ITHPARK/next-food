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
    adapter: PrismaAdapter(prisma), //NextAuth의 인증 정보를 가지고 DB에 접근을 위한 설정
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
    pages: { //인증이 필요한 페이지에 로그인 없이 접근했을 때 로그인 페이지로 리다이렉트
        signIn: "/users/login",
    },
    callbacks: { //인증상태(로그인)를 유지하기 위한 세션처리
        session: ({ session, token }) => ({
            ...session,
            user: {
            ...session.user,
            id: token.sub, //세션에 유저 정보를 추가하여 클라이언트 측에서 사용자 ID에 접근을 할 수 있게 해준다.
            },
        }),
        jwt: async ({ user, token }) => {//세션 유지를 위한 인증 토큰 생성
            if (user) {//현재 세션 데이터를 받아서 객체를 확장시키고 token.sub(사용자의 id)를 session.user.id에 추가한다.
                token.sub = user.id;
            }
            return token;
        },
    },
};