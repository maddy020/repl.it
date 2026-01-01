import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { User } from "next-auth";

export interface NextUser extends User {
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          {
            formData: {
              email: credentials?.email,
              password: credentials?.password,
            },
          }
        );
        const { user, token } = res.data;
        if (!user || !token) return null;
        return {
          ...user,
          token,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signupwithgoogle`,
            {
              formData: {
                email: user.email,
                name: user.name,
                image: user.image,
                providerId: account.providerAccountId,
              },
            }
          );
          console.log(res.data);
          const { token } = res.data;
          //@ts-ignore
          user.token = token;
          return true;
        } catch (error) {
          console.log("error in callback api", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      //@ts-ignore
      if (user?.token) {
        //@ts-ignore
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
