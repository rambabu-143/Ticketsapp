import { Status } from "@prisma/client";
import { Status as statusFire } from "@/firebase-types/types";
import prisma from "../../prisma/db";
import { TicketPageProps } from "@/app/tickets/[id]/page";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/firebase/firebase.config";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";




interface GetTicketPageParams {
  status?: statusFire;
  pageNumber: number;
  pageSize: number;
  search: string;
  description: string;
  dateFilter: string;
}




export const getHomeTicket = async () => {
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
};
export const getGroupticket = async () => {
  try {
    const ticketsRef = collection(db, "tickets"); 
    const querySnapshot = await getDocs(ticketsRef); 
    const tickets = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Grouping the tickets by 'status' and counting the occurrences of each status
    const groupTicket = tickets.reduce((acc: any, ticket: any) => {
      const status = ticket.status;
      if (!acc[status]) {
        acc[status] = { status, _count: { id: 0 } };
      }
      acc[status]._count.id += 1;
      return acc;
    }, {});

    // Converting the grouped object to an array
    const groupedTicketsArray = Object.values(groupTicket);

    return groupedTicketsArray;
  } catch (error) {
    console.error("Error fetching and grouping tickets:", error);
    throw new Error("Error fetching and grouping tickets");
  }
};

// Fetch tickets for a specific page with optional status, search, and pagination
export const getTicketPageTickets = async ({
  status,
  pageNumber,
  pageSize,
  search,
  description,
  dateFilter,
}: GetTicketPageParams) => {
  try {

    const ticketRef = collection(db, 'tickets');
    let q = query(ticketRef);

    if (status && status !== statusFire.CLOSE) {
      q = query(q, where('status', '==', status));
    } else {
      q = query(q, where('status', '!=', "CLOSE"));

    }

    // if (search) {
    //   q = query(q, where('search', '==', search));
    //   console.log('After search filter:', q);
    // }

    if (dateFilter) {
      const startOfDay = dayjs(dateFilter).startOf('day').toDate();
      const endOfDay = dayjs(dateFilter).endOf('day').toDate();
      q = query(q, where('createdAt', '>=', startOfDay), where('createdAt', '<=', endOfDay));
    }

    q = query(q, orderBy('status', 'desc'), orderBy('updatedAt', 'desc'));


    // First, try without pagination
    const allDocsSnapshot = await getDocs(q);



    q = query(q, limit(pageSize), startAfter((pageNumber - 1) * pageSize))
    // Then apply pagination
    const snapshot = await getDocs(q);

    const ticketcount = snapshot.size;

    const tickets = allDocsSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });


    return { tickets, ticketcount };
  } catch (error) {
    throw error;
  }
};

export const ticketWithId = async ({ params }: TicketPageProps) => {
  const ticketDocRef = doc(db, "tickets", params.id);
  const ticketDocSnap = await getDoc(ticketDocRef);

  if (ticketDocSnap) {
    return { id: ticketDocSnap.id, ...ticketDocSnap.data() };
  } else {
    throw new Error("Ticket not found");
  }
};

export const getAssignedTickets = async () => {
  const session = await getServerSession(options);
  if (!session?.user?.id) {
    return [];
  }

  const ticketRef = collection(db, 'tickets')
  let q = query(ticketRef, where('assignedToUser', '==', session.user.id))
  const mytickets = await getDocs(q)
  const tickets = mytickets.docs.map((doc) => {
    return {
      ...doc.data()
    }
  })


  return tickets;
};
