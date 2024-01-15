import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerify: boolean;
  type: string;
  role: string;
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: User;
    access_expire: number;
    error: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
    access_token: string;
    refresh_token: string;
  }
}
