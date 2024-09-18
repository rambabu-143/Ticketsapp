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
import { Status, TicketFire } from "@/firebase-types/types";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";

interface Dataprops {
  tickets: TicketFire[];
}

export const formatTimestamp = (timestamp: Timestamp): string => {
  if (timestamp) {
    return new Date(timestamp.toDate()).toLocaleString();
  }
  return 'No Date';
};

const Datatable = ({ tickets }: Dataprops) => {
  return (
    <div className="w-full mt-5">
      <div className="rounded-lg sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex justify-center">Title</div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center">Status</div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center">Priority</div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center">Assigned To</div> {/* New Assigned To Column */}
              </TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Ticketsstatusbatch status={ticket.status as Status} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Ticketpriority priority={ticket.priority} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {ticket.assignedToUser?.name || "Unassigned"} {/* Display assigned user or Unassigned */}
                  </div>
                </TableCell>
                <TableCell>
                  {formatTimestamp(ticket.createdAt)}
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
