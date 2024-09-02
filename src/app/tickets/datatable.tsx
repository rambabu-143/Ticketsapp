import Ticketpriority from "@/components/ticketpriority";
import Ticketsstatusbatch from "@/components/ticketsstatusbatch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "@prisma/client";
import Link from "next/link";

interface Dataprops {
  tickets: Ticket[];
}

const Datatable = ({ tickets }: Dataprops) => {
  return (
    <div className="w-full mt-5">
      <div className="rounded-lg sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex  justify-center">Title</div>
              </TableHead>
              <TableHead>
                <div className="flex  justify-center">Status</div>
              </TableHead>
              <TableHead>
                <div className="flex  justify-center">Priority</div>
              </TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Link href={`/tickets/${ticket.id}`}>
                    {ticket.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Ticketsstatusbatch status={ticket.status} />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex  justify-center">
                    <Ticketpriority priority={ticket.priority} />
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Datatable;
