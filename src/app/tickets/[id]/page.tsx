import { GetServerSideProps, NextPage } from "next";
import prisma from "../../../../prisma/db";
import TicketDisplay from "@/components/TicketDisplay";
import { ticketWithId } from "@/data-access/ticketdata";
import { Ticket } from "@prisma/client";

export interface TicketPageProps {
  params: { id: string };
}

const TicketPage: NextPage<TicketPageProps> = async ({
  params,
}: TicketPageProps) => {
  const ticket  = await ticketWithId({ params }) as Ticket;
  const users = await prisma.user.findMany();
  if (!ticket) {
    return <p className="text-destructive">Ticket not found!</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <TicketDisplay ticket={ticket} users={users} />
    </div>
  );
};

export default TicketPage;
