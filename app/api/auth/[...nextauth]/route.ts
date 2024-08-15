import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { authOptions } from '../../../lib/auth/authOptions';


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
