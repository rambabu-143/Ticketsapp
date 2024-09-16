import { GetServerSideProps, NextPage } from "next";
import prisma from "../../../../prisma/db";
import TicketDisplay from "@/components/TicketDisplay";
import { ticketWithId } from "@/data-access/ticketdata";
import { TicketFire, UserFire } from "@/firebase-types/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";

export interface TicketPageProps {
  params: { id: string };
}

const TicketPage: NextPage<TicketPageProps> = async ({
  params,
}: TicketPageProps) => {
  const ticket = await ticketWithId({ params }) as TicketFire;
  const userRef = collection(db, 'users');

  const alluser = await getDocs(userRef);
  const users = alluser.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  if (!ticket) {
    return <p className="text-destructive">Ticket not found!</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <TicketDisplay ticket={ticket} users={users as UserFire[]} />
    </div>
  );
};

export default TicketPage;
