import { GetServerSideProps, NextPage } from "next";
import { Ticket } from "@prisma/client";
import prisma from "../../../../prisma/db";
import TicketDisplay from "@/components/TicketDisplay";

interface TicketPageProps {
  params: { id: string };
}

const TicketPage: NextPage<TicketPageProps> = async ({
  params,
}: TicketPageProps) => {
  const ticket = await prisma?.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });
  const users = await prisma.user.findMany()
  if (!ticket) {
    return <p className="text-destructive">Ticket not found!</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <TicketDisplay ticket={ticket} users={users} />
    </div>
  );
};

export default TicketPage
