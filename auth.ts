import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@/firebase-types/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth as firebaseAuth } from "@/app/firebase/firebase.config";
import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app";
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },

  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }) as any,
  providers: [
    Credentials({
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
      async authorize(credentials) {
        if (!credentials) return null;

        if (
          credentials.email === "admin@gmail.com" &&
          credentials.password === "admin"
        ) {
          return {
            id: "0",
            name: "Admin",
            email: "admin@gmail.com",
            role: Role.ADMIN,
          };
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email as string,
            credentials.password as string
          );

          const user = userCredential.user;

          // Ensure 'name' field is not null
          const name = user.displayName || user.email;

          return {
            id: user.uid,
            name: name,
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

  secret: process.env.AUTH_SECRET,
  
  session: {
    strategy: "jwt",
  },
  


  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // console.log("user:", user);
        token.role = user.role || 'ADMIN';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'ADMIN';
        session.user.id = token.id as number;
      }
      return session;
    },
  },
})


