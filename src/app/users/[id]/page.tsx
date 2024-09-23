import React from "react";
import prisma from "../../../../prisma/db";
import Userform from "@/components/userForm";

import UserServices from "@/data-access/userdata";
import { UserFire } from "@/firebase-types/types";
import { auth } from "../../../../auth";

export interface UserIdProps {
  params: { id: string };
}
const Edituser = async ({ params }: UserIdProps,) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return <p className="text-destructive">Admin access required</p>;
  }
  
  const user = await UserServices.usersWithId({ params: { id: "user-id-here" } });

  if (!user) {
    return <p className="text-destructive">User not found</p>;
  }

  user.password = "";
  return <Userform user={user as UserFire} params={params}></Userform>;
};

export default Edituser;
