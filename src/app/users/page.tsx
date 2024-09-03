import Userform from "@/components/userForm";
import React from "react";
import Datatable from "./datatable";
import prisma from "../../../prisma/db";

const page = async() => {

  const users = await prisma.user.findMany()
  return (
    <div>
      <Userform />
      <Datatable users={users} />
    </div>
  );
};

export default page;
