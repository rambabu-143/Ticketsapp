import dynamic from "next/dynamic";
import React from "react";
import prisma from "../../../../../prisma/db";
import { ticketWithId } from "@/data-access/ticketdata";
const Ticketform = dynamic(() => import("@/components/ticketform"), {
  ssr: false,
});

interface Props {
  params: { id: string };
}
const EditTicket = async ({ params }: Props) => {
  const ticket = await ticketWithId({params})
  if(!ticket){
    return <p className="text-destructive">Ticket not found!</p>
  }
  return <div>
    <Ticketform ticket={ticket}/>
  </div>;
};

export default EditTicket;
