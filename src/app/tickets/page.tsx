import Link from "next/link";
import Datatable from "./datatable";
import { Button } from "@/components/ui/button";
import Pagenation from "@/components/Pagenation";
import StatusFilter from "@/components/statusFilter";
import { Status as statusFire } from "@/firebase-types/types";
import {  TicketServices } from "@/data-access/ticketdata";
import SearchBar from "@/components/SearchBar";
import dayjs from "dayjs";
import DateFilter from "@/components/dateFilter";
import { TicketFire } from "@/firebase-types/types";

interface SearchParams {
  status?: statusFire;
  page?: string;
  search: string;
  description: string;
  dateFilter: string;
}

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;
  const pageNumber: number = parseInt(searchParams.page || "1", 10);
  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  let dateFilter = searchParams.dateFilter || "";
  if (searchParams.dateFilter === "today") {
    dateFilter = today;
  } else if (searchParams.dateFilter === "tomorrow") {
    dateFilter = tomorrow;
  } else if (searchParams.dateFilter === "yesterday") {
    dateFilter = yesterday;
  }

  const { tickets, ticketcount } = await TicketServices.getTicketPageTickets({
    status: searchParams.status,
    search: searchParams.search,
    description: searchParams.description,
    pageNumber,
    pageSize,
    dateFilter,
  });

  return (
    <div className="flex flex-col gap-6 p-4">
      <SearchBar initialSearch={searchParams.search} />

      <Link href="/tickets/new">
        <Button>New Ticket</Button>
      </Link>

      <StatusFilter />

      <DateFilter />

      {tickets.length === 0 ? (
        <div className="text-center text-gray-500">No tickets were found.</div>
      ) : (
        <>
          <Datatable tickets={tickets as TicketFire[]} />

          <Pagenation
            itemCount={ticketcount}
            currentPage={pageNumber}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
};

export default page;
