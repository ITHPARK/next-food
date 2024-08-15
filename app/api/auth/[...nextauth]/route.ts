import NextAuth, { NextAuthOptions } from 'next-auth';
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
    callbacks: {
        session: ({ session, token }) => ({
        ...session,
        user: {
            ...session.user,
            id: token.sub,
        }
        }),
        jwt: async ({ user, token }) => {
        if (user) {  //현재 세션 데이터를 받아서 객체를 확장시키고 token.sub(사용자의 id)를 session.user.id에 추가한다.
            token.sub = user.id;
        }
        return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };