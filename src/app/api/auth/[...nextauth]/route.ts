import NextAuth, { Awaitable, NextAuthOptions, RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt, { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { User } from "@prisma/client";


declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });
      if (!user) return null;
      const ok = await bcrypt.compare(credentials.password, user.password);
      if (!ok) return null;
      // return minimal object for session/jwt callbacks
      return {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        role: user.role
      };
    }
  })
],
  callbacks: {
    async session({ session, token }) {
      if (token && session && session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if (token.sub) {
          user.id = token.sub;
        }
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };