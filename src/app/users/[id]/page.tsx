import React from "react";
import prisma from "../../../../prisma/db";
import Userform from "@/components/userForm";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { usersWithId } from "@/data-access/userdata";
import { UserFire } from "@/firebase-types/types";

export interface UserIdProps {
  params: { id: string };
}
const Edituser = async ({ params }: UserIdProps,) => {
  const session = await getServerSession(options);

  if (session?.user.role !== "ADMIN") {
    return <p className="text-destructive">Admin access required</p>;
  }
  const user = await usersWithId({ params });
  if (!user) {
    return <p className="text-destructive">User not found</p>;
  }

  user.password = "";
  return <Userform user={user as UserFire}></Userform>;
};

export default Edituser;
