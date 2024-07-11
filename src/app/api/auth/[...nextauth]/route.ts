import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // name: "Sign in",
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
        });

        if (!user) {
          return null;
        }

        console.log(`Found user: ${user.email}`);

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password
        );
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        console.log("Password is valid");

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.profileName,
          username: user.username,
          profilePicture: user.profilePicture,
          profileBanner: user.profileBanner,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session Callback", { session, token });
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.profilePicture = token.profilePicture as string;
      session.user.profileBanner = token.profileBanner as string;
      return session;
    },

    async jwt({ token, user }) {
      console.log("JWT Callback", { token, user });
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.profilePicture = user.profilePicture;
        token.profileBanner = user.profileBanner;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
