import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../../db";
import {authOptions} from "./options"


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };