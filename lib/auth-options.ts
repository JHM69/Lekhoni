import { NextAuthOptions } from "next-auth"; 
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials"; 
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../prisma/prisma-client';
import { env } from "process";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      session = {
        ...session,
        user: {
          ...session.user,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          id: token?.sub,
          passwordHash: token?.passwordHash,
        },
      };
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: env.JWT_SECRET,
  // Configure one or more authentication providers 
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "landsat@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = user.passwordHash ? await bcrypt.compare(credentials.password, user.passwordHash) : false;

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    })
  ],
  pages: {
    signIn: "/",  
  },
};
