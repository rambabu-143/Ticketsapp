"use client";

import { TicketFire, UserFire } from "@/firebase-types/types";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";

interface AssignTicketProps {
  ticket: TicketFire;
  user: UserFire[];
}

const AssignTicket = ({ ticket, user }: AssignTicketProps) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(ticket.assignedToUserId?.toString() || "0");

  const assignTicket = async (userId: string) => {
    setError("");
    setIsAssigning(true);
    setSelectedUserId(userId); 

    try {
      const selectedUser = user.find((u) => u.id.toString() === userId) ;

      const ticketRef = doc(db, "tickets", ticket.id);
      await updateDoc(ticketRef, {
        assignedToUserId: userId === "0" ? null : userId, 
        assignedToUser: selectedUser ? selectedUser : null, 
      });
    } catch (error) {
      console.error("Unable to assign ticket: ", error);
      setError("Unable to assign ticket");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Select
        value={selectedUserId}
        onValueChange={assignTicket}
        disabled={isAssigning}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select user" />
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

      {error && <p className="text-destructive">{error}</p>}
    </>
  );
};

export default AssignTicket;
