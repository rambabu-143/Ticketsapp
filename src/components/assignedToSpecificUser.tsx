import React from "react";
import { Ticket, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

// Define the ticket type including assignedToUser
interface TicketWithAssignedUser extends Ticket {
  assignedToUser: {
    id: number;
    name: string;
    username: string;
    password: string;
    role: Role;
  } | null;
}

interface AssignedToSpecificUserProps {
  tickets: TicketWithAssignedUser[];
}

const AssignedToSpecificUser: React.FC<AssignedToSpecificUserProps> = async ({
  tickets,
}) => {
  const session = await getServerSession(options);
  const assignedTickets = tickets.filter(
    (ticket) => ticket.assignedToUser?.name === session?.user.name
  );
  console.log(session);
  return (
    <div>

      <h1>Assigned Tickets are :</h1>
      {assignedTickets.length > 0 ? (
        <div className="flex  justify-center items-center gap-6">
          {assignedTickets.map((ticket) => (
            <div key={ticket.id} className="flex justify-center items-center gap-3">
              <h3 className="text-blue-900">{ticket.title} :</h3>
              <p>{ticket.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No assigned tickets</div>
      )}
    </div>
  );
};

export default AssignedToSpecificUser;
