"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  ticketId: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ ticketId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/tickets/${ticketId}`);
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
