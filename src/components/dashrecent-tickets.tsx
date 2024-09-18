
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Ticketsstatusbatch from "./ticketsstatusbatch";
import Link from "next/link";
import Ticketpriority from "./ticketpriority";
import { Status, TicketFire } from "@/firebase-types/types";



interface Props {
  tickets: TicketFire[];
}

const DashRecentTickets = ({ tickets }: Props) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recently Updated</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {tickets.map((ticket) => (
            <div className="flex items-center" key={ticket.id}>
              <Ticketsstatusbatch status={ticket.status as Status} />
              <div className="ml-4 space-y-1">
                <Link href={`tickets/${ticket.id}`}>
                  <p className="font-medium">{ticket.title}</p>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {ticket.assignedToUser?.name || "Unassigned"}
                </p>
              </div>
              <div className="flex ml-auto">
                <Ticketpriority priority={ticket.priority} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashRecentTickets;