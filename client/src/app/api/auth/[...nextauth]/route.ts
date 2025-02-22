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
          credentials.password,
        );

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        console.log("Password is valid");

        if (!isPasswordValid) {
          return null;
        }

        if (
          user &&
          (await argon2.verify(user.password, credentials?.password))
        ) {
          return {
            id: user.id + "",
            email: user.email,
            // name: user.profileName,
            name: user.profileName ?? user.username,
            username: user.username,
            profileName: user.profileName,
            profilePicture: user.profilePicture,
            profileBanner: user.profileBanner,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user && account) {
        // This runs only on initial sign in
        token.id = user.id;
        token.username = user.username;
        token.profileName = user.profileName;
        token.profilePicture = user.profilePicture;
        token.profileBanner = user.profileBanner;
      }

      // Fetch fresh user data on every JWT refresh
      // const freshUser = await prisma.user.findUnique({
      //   where: { id: token.id as string },
      //   select: {
      //     id: true,
      //     username: true,
      //     profileName: true,
      //     profilePicture: true,
      //     profileBanner: true,
      //     color: true,
      //   },
      // });

      // Handle account switching
      if (trigger === "update" && session?.switchToUserId) {
        const switchToUser = await prisma.user.findUnique({
          where: { id: session.switchToUserId },
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
            profileBanner: true,
          },
        });

        if (switchToUser) {
          token.id = switchToUser.id;
          token.username = switchToUser.username;
          token.profileName = switchToUser.profileName;
          token.profilePicture = switchToUser.profilePicture;
          token.profileBanner = switchToUser.profileBanner;
        }
      } else {
        // Fetch fresh user data on every JWT refresh
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            username: true,
            profileName: true,
            profilePicture: true,
            profileBanner: true,
          },
        });

        if (freshUser) {
          token.username = freshUser.username;
          token.profileName = freshUser.profileName;
          token.profilePicture = freshUser.profilePicture;
          token.profileBanner = freshUser.profileBanner;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.profileName = token.profileName as string | undefined;
        session.user.profilePicture = token.profilePicture as
          | string
          | undefined;
        session.user.profileBanner = token.profileBanner as string | undefined;
        session.user.color = token.color as string | undefined;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
