// C:\barbearia\app/_providers/auth.tsx

import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import { Adapter, AdapterSession } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../_lib/prisma";
import GoogleProvider from "next-auth/providers/google";

interface CustomAdapterSession extends AdapterSession {
  user: {
    id: string;
  };
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        }
      };
    },  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);