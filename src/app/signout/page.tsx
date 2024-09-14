"use client";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    console.log("Signout button clicked!");
    try {
      await firebaseSignOut(auth);
      await nextAuthSignOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Signout</button>
    </div>
  );
};

export default Page;
