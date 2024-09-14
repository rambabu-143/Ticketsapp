import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmJGDlVKKhRBz0GBcOV3bfT_C6SenJmv0",
  authDomain: "next-auth-demo-9fd4a.firebaseapp.com",
  projectId: "next-auth-demo-9fd4a",
  storageBucket: "next-auth-demo-9fd4a.appspot.com",
  messagingSenderId: "925415374662",
  appId: "1:925415374662:web:64d4cd3ed346a718cbef47",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
