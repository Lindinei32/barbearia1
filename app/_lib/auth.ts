import { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { db } from "./prisma"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

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
      session.user = {
        ...session.user,
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
