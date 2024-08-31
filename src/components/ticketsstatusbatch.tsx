import { Status } from "@prisma/client";
import { Badge } from "./ui/badge";

interface ticketprops {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "bg-red-400" | "bg-blue-400" | "bg-green-400" }
> = {
  OPEN: { label: "Open", color: "bg-blue-400" },
  STARTED: { label: "Started", color: "bg-green-400" },
  CLOSE: { label: "Closed", color: "bg-red-400" },
};
const Ticketsstatusbatch = ({ status }: ticketprops) => {
  return <div>


    <Badge className={`${statusMap[status].color}`}>{statusMap[status].label}</Badge>
  </div>;
};

export default Ticketsstatusbatch;
