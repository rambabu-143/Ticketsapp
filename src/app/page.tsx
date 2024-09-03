import prisma from "../../prisma/db";

export default async function Home() {

  const tickets = await prisma.ticket.findMany({
    where:{
      NOT:[{status:"CLOSE"}],
    },
    orderBy:{
      UpdatedAt:"desc",
    },
    skip:0,
    take:5,
    include:{
      assignedToUser:true,
    }
  })
  return (
    <>
      <p>Home page</p>
    </>
  );
}
