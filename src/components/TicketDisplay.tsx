// components/TicketDisplay.tsx
import React from "react";
import { Ticket } from "@prisma/client";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

interface TicketDisplayProps {
  ticket: Ticket;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ ticket }) => {
  return (
    <div className="border rounded-md p-6 shadow-md">
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
        {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="flex justify-start mt-3 items-center gap-5">
        <Link href={`/tickets/edit/${ticket.id}`}>
          <p className="text-blue-500 hover:underline">Edit</p>
        </Link>
        <DeleteButton ticketId={ticket.id} />
      </div>
    </div>
  );
};

export default TicketDisplay;
