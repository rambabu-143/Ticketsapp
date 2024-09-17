import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/firebase.config";
import GoogleProvider from "next-auth/providers/google";
import { UserFire } from "@/firebase-types/types";

const options: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Username and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter email...",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        if (
          credentials.email == "admin@gmail.com" &&
          credentials.password == "admin"
        ) {
          return {
            id: 0,
            name: "Admin",
            username: "admin",
            password: "admin",
            role: Role.ADMIN,
          } ;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;
          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            role: Role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        console.log("user:", user);
        token.role = user.role || 'ADMIN';
        token.id = user.id ;
        console.log("user LLLLLz")
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'ADMIN';
        session.user.id = token.id ;
        console.log("session:", session, "token:", token);
      }
      return session;
    },
  },
};

export default options;
