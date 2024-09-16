// components/TicketDisplay.tsx
import React from "react";
import { Ticket, User } from "@prisma/client";
import { formatTimestamp } from "@/app/tickets/datatable";
import { TicketFire , UserFire } from "@/firebase-types/types";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import AssignTicket from "./assignticket";

interface TicketDisplayProps {
  ticket: TicketFire;
  users: UserFire[];
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ ticket, users }) => {
  return (
    <div className="flex">
      <div className="border rounded-md p-6 w-full shadow-md">
        <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        <div className="flex items-center justify-start gap-4">
          <span className="font-semibold">Status:</span>
          <span>{ticket.status}</span>
        </div>
        <div className="flex items-center justify-start gap-4 mt-2">
          <span className="font-semibold">Priority:</span>
          <span>{ticket.priority}</span>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Created At:{" "}
          {formatTimestamp(ticket.createdAt)}
        </div>
      </div>
      <div className="flex flex-col justify-start mt-3 w-1/2 items-center gap-5">
        <AssignTicket ticket={ticket} user={users} />
        <Link href={`/tickets/edit/${ticket.id}`} className="w-full flex justify-center items-center">
          <p className="text-white py-4 px-6 rounded-xl bg-blue-700 hover:underline">Edit</p>
        </Link>
        <DeleteButton ticketId={ticket.id} />
      </div>
    </div>
  );
};

export default TicketDisplay;
