import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
// 필요에 따라 Provider를 추가할 수 있습니다.

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
});

export { handler as GET, handler as POST };
