import DashRecentTickets from "@/components/dashrecent-tickets";
import DashChart from "@/components/dashChart";
import { TicketServices } from "@/data-access/ticketdata";
import AssignedToSpecificUser from "@/components/assignedToSpecificUser";
import { TicketFire } from "@/firebase-types/types";

export default async function Home() {
  const tickets = await TicketServices.getHomeTicket();

  const groupTicket = await TicketServices.getGroupticket();

  const data = groupTicket.map((item: any) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <div className="flex flex-col gap-3">
          <DashRecentTickets tickets={tickets as TicketFire[]} />
          <AssignedToSpecificUser />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </>
  );
}
