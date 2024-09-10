import { Status } from "@prisma/client";
import prisma from "../../prisma/db";
import { TicketPageProps } from "@/app/tickets/[id]/page";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

interface GetTicketPageTicketsParams {
  status?: Status;
  pageNumber: number;
  pageSize: number;
  search: string;
  description: string;
  dateFilter: string;
}

export const getHomeTicket = async () => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: { status: Status.CLOSE },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });
  return tickets;
};
export const getGroupticket = async () => {
  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
  return groupTicket;
};

// Fetch tickets for a specific page with optional status, search, and pagination
export const getTicketPageTickets = async ({
  status,
  pageNumber,
  pageSize,
  search,
  description,
  dateFilter,
}: GetTicketPageTicketsParams) => {
  const where: any = {};

  if (status && status !== Status.CLOSE) {
    where.status = status;
  } else {
    where.NOT = { status: Status.CLOSE };
  }

  if (search) {
    where.title = {
      contains: search || description,
      mode: "insensitive",
    };
  }
  if (dateFilter) {
    const startOfDay = new Date(dayjs(dateFilter).startOf("day").toISOString());
    const endOfDay = new Date(dayjs(dateFilter).endOf("day").toISOString());

    where.createdAt = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const ticketcount = await prisma.ticket.count({ where });

  const tickets = await prisma.ticket.findMany({
    where,
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return { ticketcount, tickets };
};

export const ticketWithId = async ({ params }: TicketPageProps) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  return ticket;
};

export const getAssignedTickets = async () => {
  const session = await getServerSession(options);
  console.log(session);
  if (!session!.user.id) {
    return [];
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      assignedToUser: {
        id: session!.user.id,
      },
    },
  });

  return tickets;
};
