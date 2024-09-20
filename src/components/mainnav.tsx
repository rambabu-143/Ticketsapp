import Link from "next/link";
import React from "react";
import Tooglemode from "./tooglemode";
import { auth } from "../../auth";

const Mainnav = async () => {
  const session = await auth();

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
          <Link href="/signout">Logout</Link>
        ) : (
          <Link href="/signin">Login</Link>
        )}

        <Tooglemode />
      </div>
    </div>
  );
};

export default Mainnav;
