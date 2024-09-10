import { getAssignedTickets } from "@/data-access/ticketdata";



const AssignedToSpecificUser= async () => {
 

  const tickets =await getAssignedTickets() 
  return (
    <div>

      <h1>Assigned Tickets are :</h1>
      {tickets.length > 0 ? (
        <div className="flex  justify-center items-center gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex justify-center items-center gap-3">
              <h3 className="text-blue-900">{ticket.title} :</h3>
              <p>{ticket.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No assigned tickets</div>
      )}
    </div>
  );
};

export default AssignedToSpecificUser;
