import Userform from "@/components/userForm";
import React from "react";
import Datatable from "./datatable";
import { getUserdata } from "@/data-access/userdata";
import { UserFire } from "@/firebase-types/types";

const page = async () => {
  // const session = await getServerSession(options)

  //   if(session?.user.role !== 'ADMIN'){
  //     return <p className="text-destructive">Admin access required</p>
  //   }
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
