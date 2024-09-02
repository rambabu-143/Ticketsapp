import Link from "next/link";
import prisma from "../../../prisma/db";
import Datatable from "./datatable";
import { Button } from "@/components/ui/button";

const page = async () => {
  const tickets = await prisma.ticket.findMany();
  return (
    <div className="flex flex-col p-4">
      <Link href='/tickets/new'><Button>New Ticket</Button></Link>
      <Datatable tickets={tickets} />
    </div>
  );
};

export default page;
