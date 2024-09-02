import Link from "next/link";
import prisma from "../../../prisma/db";
import Datatable from "./datatable";
import { Button } from "@/components/ui/button";
import Pagenation from "@/components/Pagenation";

interface SearchParams {
  page: string;
}

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;
  const page = parseInt(searchParams.page) || 1;
  const ticketcount = await prisma.ticket.count();
  const tickets = await prisma.ticket.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
  });
  return (
    <div className="flex flex-col p-4">
      <Link href="/tickets/new">
        <Button>New Ticket</Button>
      </Link>
      <Datatable tickets={tickets} />
      <Pagenation
        itemCount={ticketcount}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  );
};

export default page;
