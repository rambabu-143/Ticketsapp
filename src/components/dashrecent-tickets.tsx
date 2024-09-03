import { Prisma } from "@prisma/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Ticketsstatusbatch from "./ticketsstatusbatch";
import Link from "next/link";
import Ticketpriority from "./ticketpriority";

type TicketWithUser = Prisma.TicketGetPayload<{
  include: { assignedToUser: true };
}>;

interface Props {
  tickets: TicketWithUser[];
}

const DashRecentTickets = ({ tickets }: Props) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recently Updated</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {tickets
            ? tickets.map((ticket) => (
                <div className="flex items-center" key={ticket.id}>
                  <Ticketsstatusbatch status={ticket.status} />
                  <div className="ml-4 space-y-1">
                    <Link href={`tickets/${ticket.id}`}></Link>
                    <p>{ticket.title}</p>
                    <p>{ticket.assignedToUser?.name || "Unassigned"}</p>
                  </div>
                  <div className="flex ml-4">
                    <Ticketpriority priority={ticket.priority}/>
                  </div>
                </div>
              ))
            : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashRecentTickets;
