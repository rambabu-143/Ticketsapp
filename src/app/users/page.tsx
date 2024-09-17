import Userform from "@/components/userForm";
import React from "react";
import Datatable from "./datatable";
import { getUserdata } from "@/data-access/userdata";
import { UserFire } from "@/firebase-types/types";

const page = async () => {

  const users = await getUserdata()
  const params ={id:""}

  console.log("res::", users)
  return (
    <div>
      <Userform  params={params}/>
      <Datatable users={users as UserFire[]} />
    </div>
  );
};

export default page;
