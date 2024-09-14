"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result!.error) {
      alert(result!.error);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handlegoogleclick = async () => {
    try {
      await signIn("google", { redirect: true ,callbackUrl:'/' });
    } catch (error) {
      console.error("Google SignIn Error", error);
      alert("Google Sign-In failed");
    }
    
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Sign In
        </button>
      </form>

      <div>
        <button onClick={handlegoogleclick}>Signin with Google</button>
      </div>

      <div className="mt-4 text-center">
        <p>
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
