import dynamic from "next/dynamic";
import React from "react";
const Ticketform = dynamic(() => import("@/components/ticketform"), {
  ssr: false,
});
const NewTicket = () => {
  return (
    <div className="p-4">
      <Ticketform />
    </div>
  );
};

export default NewTicket;
