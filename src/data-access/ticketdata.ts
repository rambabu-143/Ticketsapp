import { Status as statusFire } from "@/firebase-types/types";
import prisma from "../../prisma/db";
import { TicketPageProps } from "@/app/tickets/[id]/page";
import dayjs from "dayjs";
import { db } from "@/app/firebase/firebase.config";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { auth } from "../../auth";

interface GetTicketPageParams {
  status?: statusFire;
  pageNumber: number;
  pageSize: number;
  search: string;
  description: string;
  dateFilter: string;
}

export class TicketServices {
  
  // Fetch home tickets
  public static async getHomeTicket() {
    try {
      const ticketsRef = collection(db, "tickets");
      const q = query(
        ticketsRef,
        where("status", "!=", statusFire.CLOSE),
        orderBy("updatedAt", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const tickets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return tickets;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error("Error fetching tickets");
    }
  }

  // Fetch and group tickets by status
  public static async getGroupticket() {
    try {
      const ticketsRef = collection(db, "tickets");
      const querySnapshot = await getDocs(ticketsRef);
      const tickets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const groupTicket = tickets.reduce((acc: any, ticket: any) => {
        const status = ticket.status;
        if (!acc[status]) {
          acc[status] = { status, _count: { id: 0 } };
        }
        acc[status]._count.id += 1;
        return acc;
      }, {});

      const groupedTicketsArray = Object.values(groupTicket);
      return groupedTicketsArray;
    } catch (error) {
      console.error("Error fetching and grouping tickets:", error);
      throw new Error("Error fetching and grouping tickets");
    }
  }


  public static async getTicketPageTickets({
    status,
    pageNumber,
    pageSize,
    search,
    description,
    dateFilter,
  }: GetTicketPageParams) {
    try {
      const ticketRef = collection(db, 'tickets');
      let q = query(ticketRef);

      if (status && status !== statusFire.CLOSE) {
        q = query(q, where('status', '==', status));
      } else {
        q = query(q, where('status', '!=', "CLOSE"));
      }

      if (dateFilter) {
        const startOfDay = dayjs(dateFilter).startOf('day').toDate();
        const endOfDay = dayjs(dateFilter).endOf('day').toDate();
        q = query(q, where('createdAt', '>=', startOfDay), where('createdAt', '<=', endOfDay));
      }

      q = query(q, orderBy('status', 'desc'), orderBy('updatedAt', 'desc'));

      const allDocsSnapshot = await getDocs(q);

      q = query(q, limit(pageSize), startAfter((pageNumber - 1) * pageSize));

      const snapshot = await getDocs(q);
      const ticketcount = snapshot.size;

      const tickets = allDocsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      return { tickets, ticketcount };
    } catch (error) {
      throw error;
    }
  }

  // Fetch ticket by ID
  public static async ticketWithId({ params }: TicketPageProps) {
    const ticketDocRef = doc(db, "tickets", params.id);
    const ticketDocSnap = await getDoc(ticketDocRef);

    if (ticketDocSnap.exists()) {
      return { id: ticketDocSnap.id, ...ticketDocSnap.data() };
    } else {
      throw new Error("Ticket not found");
    }
  }

  // Fetch tickets assigned to the logged-in user
  public static async getAssignedTickets() {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    const ticketRef = collection(db, 'tickets');
    let q = query(ticketRef, where('assignedToUserId', '==', session.user.id));
    const mytickets = await getDocs(q);
    const tickets = mytickets.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });
    return tickets;
  }
}
