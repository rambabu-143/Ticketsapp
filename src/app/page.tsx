import DashRecentTickets from "@/components/dashrecent-tickets";
import DashChart from "@/components/dashChart";
import { getGroupticket, getHomeTicket } from "@/data-access/ticketdata";

export default async function Home() {
  const tickets = await getHomeTicket();

  const groupTicket = await getGroupticket();

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <div>
          <DashRecentTickets tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </>
  );
}
