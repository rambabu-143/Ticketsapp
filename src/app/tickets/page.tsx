import prisma from "../../../prisma/db";
import Datatable from "./datatable";

const page = async () => {
  const tickets = await prisma.ticket.findMany();
  return (
    <div>
      <Datatable tickets={tickets} />
    </div>
  );
};

export default page;
