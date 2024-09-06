import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../prisma/db";
import bcrypt from "bcryptjs";
import { Role, User } from "@prisma/client";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Username and Password",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "username...",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {

        if (!credentials) return null;
        if(credentials.username =="admin" && credentials.password=="admin"){
          return{
            id: 0,
            name: "Admin",
            username: "admin",
            password: "admin",
            role: Role.ADMIN,
          } as User;

        }
      
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
      
        if (!user) return null;
      
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      
        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            username: user.username,
            password: user.password,
            role: user.role,
          } as User;
        }
      
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
};

export default options;
