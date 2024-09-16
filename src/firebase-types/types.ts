
enum Status {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
}

enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}
enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}



export interface UserFire {
    id: number;
    name: string;
    username: string;
    password: string;
    role: Role;
    assignedTickets: TicketFire[];  
}

export interface TicketFire {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
    assignedToUserId?: number | null;
    assignedToUser?: UserFire | null;
}
