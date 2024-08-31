import Link from "next/link";
import React from "react";
import Tooglemode from "./tooglemode";

const Mainnav = () => {
  return (
    <div className="flex justify-between w-full p-4">
      <div className="flex justify-center  gap-6 items-center ">
        <Link href="/">Dashboard</Link>
        <Link href="/tickets">Tickets</Link>
        <Link href="/users">Users</Link>
      </div>

      <div className=" flex  gap-6">
        <Link href="/">Logout</Link>
        <Tooglemode/>
      </div>
    </div>
  );
};

export default Mainnav;
