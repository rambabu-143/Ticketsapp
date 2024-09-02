import Link from "next/link";
import prisma from "../../../prisma/db";
import Datatable from "./datatable";
import { Button } from "@/components/ui/button";
import Pagenation from "@/components/Pagenation";
import StatusFilter from "@/components/statusFilter";
import { Status } from "@prisma/client";

interface SearchParams {
  status?: Status;
  page?: string;
}

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;
  const pageNumber = parseInt(searchParams.page || "1", 10);
  const statuses = Object.values(Status);

  const status = statuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;

  const where = status
    ? { status }
    : { NOT: { status: Status.CLOSE } }; 

  const ticketcount = await prisma.ticket.count({ where });
  const tickets = await prisma.ticket.findMany({
    where,
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
  });

  return (
    <div className="flex flex-col gap-6 p-4">
      <Link href="/tickets/new">
        <Button>New Ticket</Button>
      </Link>
      <StatusFilter />
      <Datatable tickets={tickets} />
      <Pagenation
        itemCount={ticketcount}
        currentPage={pageNumber}
        pageSize={pageSize}
      />
    </div>
  );
};

export default page;
