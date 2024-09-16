import { UserIdProps } from "@/app/users/[id]/page";
import prisma from "../../prisma/db";
import { collection, doc, getDoc, getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";
import { UserFire } from "@/firebase-types/types";
export const getUserdata = async () => {
  const useref = collection(db, 'users');
  const snapshot = await getDocs(useref);
  const users = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  });
  return users
};

export const usersWithId = async ({ params }: UserIdProps) => {

  const userRef = doc(db, 'users', params.id);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null; 
  }

  return {
    ...userDoc.data() as UserFire,
  };
};
