import Userform from "@/components/userForm";
import React from "react";
import Datatable from "./datatable";
import { getUserdata } from "@/data-access/userdata";
import { UserFire } from "@/firebase-types/types";

const page = async () => {

  const users = await getUserdata()

  console.log("res::", users)
  return (
    <div>
      <Userform />
      <Datatable users={users as UserFire[]} />
    </div>
  );
};

export default page;
