import React from "react";
import prisma from "../../../../prisma/db";
import Userform from "@/components/userForm";

interface Props {
  params: { id: string };
}
const Edituser = async ({ params }: Props) => {
  const user = await prisma?.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return <p className="text-destructive">User not found</p>;
  }

  user.password = "";
  return <Userform user={user}></Userform>;
};

export default Edituser;
