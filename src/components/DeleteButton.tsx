"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";

interface DeleteButtonProps {
  ticketId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ ticketId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      const ticketDoc = doc(db, "tickets", ticketId); 
      await deleteDoc(ticketDoc);
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-white hover:underline bg-red-600 py-4 px-8"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
