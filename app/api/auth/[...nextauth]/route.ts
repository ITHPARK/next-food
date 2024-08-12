import NextAuth, {NextAuthOptions} from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../../db";
// 필요에 따라 Provider를 추가할 수 있습니다.




export const authOptions:NextAuthOptions = {
  session: {
    strategy: "jwt" as const, 
    maxAge: 60 * 60 * 24, //초단위로 24시간 유지
    updateAge: 60* 60 * 2, //초단위로 2시간 유지
  },  
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
  callbacks: {
    session: ({session, token}) => ({
      ...session,
      user: { //현재 세션 데이터를 받아서 객체를 확장시키고 token.sub(사용자의 id)를 session.user.id에 추가한다.
        ...session.user,
        id: token.sub,
      }
    }),
    jwt: async ({user, token}) => {
      if(user) { //처음 로그인 할 때 token.sub에 user.id를 저장한다.
        token.sub = user.id
      }

      return token;
    },

  },

};

const handler = NextAuth(authOptions)

//GET과 POST HTTP 메서드로 내보낸다
export { handler as GET, handler as POST };
