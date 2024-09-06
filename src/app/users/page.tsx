import Userform from "@/components/userForm";
import React from "react";
import Datatable from "./datatable";
import prisma from "../../../prisma/db";
import { getServerSession } from "next-auth";
import options from "../api/auth/[...nextauth]/options";
import { getUserdata } from "@/data-access/userdata";

const page = async() => {
const session = await getServerSession(options)

  if(session?.user.role !== 'ADMIN'){
    return <p className="text-destructive">Admin access required</p>
  }
  const users = await getUserdata()
  return (
    <div>
      <Userform />
      <Datatable users={users} />
    </div>
  );
};

export default page;
