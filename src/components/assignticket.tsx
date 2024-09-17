"use client";

import { TicketFire, UserFire } from "@/firebase-types/types";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";

const AssignTicket = ({ ticket, user }: { ticket: TicketFire; user: UserFire[] }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, seterror] = useState("");

  const assignTicket = async (userId: string) => {
    seterror("");
    setIsAssigning(true);


    try {

      const ticketRef = doc(db, 'tickets', ticket.id)
      await updateDoc(ticketRef, {
        assignedToUserId: userId === "0" ? null : userId,
      });
    }
    catch (error) {
      console.error("Unable to assign ticket: ", error);
      seterror("Unable to assign ticket");
    }
    setIsAssigning(false);
  };


  return (
    <>
      <Select
        defaultValue={ticket.assignedToUserId?.toString() || "0"}
        onValueChange={assignTicket}
        disabled={isAssigning}
      >
        <SelectTrigger
        >
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
