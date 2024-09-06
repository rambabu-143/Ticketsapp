import { UserIdProps } from "@/app/users/[id]/page";
import prisma from "../../prisma/db";
export const getUserdata = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const usersWithId = async ({params}:UserIdProps) => {
  const user = await prisma?.user.findUnique({
    where: { id: parseInt(params.id) },
  });
  return user
};
