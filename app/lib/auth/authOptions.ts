import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../db';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24, // 24시간
        updateAge: 60 * 60 * 2, // 2시간
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || '',
            clientSecret: process.env.NAVER_CLIENT_SECRET || ''
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || '',
            clientSecret: process.env.KAKAO_CLIENT_SECRET || ''
        })
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/users/login',
    },
    callbacks: {
        session: async ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            }
        }),
        jwt: async ({ user, token }) => {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
};
