import { UserIdProps } from "@/app/users/[id]/page";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";
import { auth as firebaseAuth } from "@/app/firebase/firebase.config";
import { Role, UserFire } from "@/firebase-types/types";
import { createUserWithEmailAndPassword } from "firebase/auth";

class UserServices {

  public static async getUserdata() {
    try {
      const useref = collection(db, 'users');
      const snapshot = await getDocs(useref);
      const users = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  public static async usersWithId({ params }: UserIdProps) {
    try {
      const userRef = doc(db, 'users', params.id);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      return {
        ...userDoc.data() as UserFire,
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  // Sign up a new user and store them in Firestore
  public static async signupUser({ email, password, name }: { email: string; password: string; name: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      // Add the user to Firestore with the specified role
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: Role.USER,
        createdAt: new Date().toISOString(),
      });

      return {
        id: user.uid,
        name: name,
        email: user.email,
        role: Role.USER,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
}

export default UserServices;
