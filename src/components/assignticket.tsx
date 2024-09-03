"use client";

import { Ticket, User } from "@prisma/client";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue } from "./ui/select";
import { SelectContent, SelectItem } from "@radix-ui/react-select";
import axios from "axios";

const AssignTicket = ({ ticket, user }: { ticket: Ticket; user: User[] }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, seterror] = useState("");

  const assignTicket = async (userId: string) => {
    seterror("");
    setIsAssigning(true);
    await axios
      .patch(`/api/tickets/${ticket.id}`, {
        assignedToUserId: userId === "0" ? null : userId,
      })
      .catch(() => {
        seterror("Unable to assign ticket");
      });
    console.log(error);
    setIsAssigning(false);
  };

  return (
    <>
      <Select
        defaultValue={ticket.assignedToUserId?.toString() || "0"}
        onValueChange={assignTicket}
        disabled={isAssigning}
      >
        <SelectTrigger>
          <SelectValue
            placeholder="Select user"
            defaultValue={ticket.assignedToUserId?.toString() || "0"}
          ></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Unassign</SelectItem>
          {user.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-destructive">{error}</p>
    </>
  );
};

export default AssignTicket;
