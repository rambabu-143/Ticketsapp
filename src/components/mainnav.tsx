import Link from "next/link";
import React from "react";
import Tooglemode from "./tooglemode";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

const Mainnav = async () => {
  const session = await getServerSession(options);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex justify-between w-full p-4">
      <div className="flex justify-center gap-6 items-center">
        <Link href="/">Dashboard</Link>
        <Link href="/tickets">Tickets</Link>
        {isAdmin && <Link href="/users">Users</Link>}
      </div>

      <div className="flex gap-6">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}

        <Tooglemode />
      </div>
    </div>
  );
};

export default Mainnav;
