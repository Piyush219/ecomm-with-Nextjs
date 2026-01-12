import NextAuth from "next-auth";
import { prisma } from "./db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // finding user in database

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user, trigger }: any) {
      // setting user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      
      if (trigger === "update") {
        session.user.name = user.name;
      }
      // console.log("Session in call back :: ", session);

      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },

    authorized({ request, auth}) {
      // check for session cart cookie
      if(!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        
        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        
        response.cookies.set("sessionCartId", sessionCartId, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          // maxAge: 30 * 24 * 60 * 60,
          // path: "/",
        });

        return response;
      } else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
