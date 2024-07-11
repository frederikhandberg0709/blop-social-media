import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      profileName?: string;
      profilePicture?: string;
      profileBanner?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    profilePicture?: string;
    profileBanner?: string;
  }

  interface User {
    id: string;
    username: string;
    profilePicture?: string;
    profileBanner?: string;
  }
}
