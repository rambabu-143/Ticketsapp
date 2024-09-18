import { Timestamp } from "firebase/firestore";

export enum Status {
    OPEN = 'OPEN',
    STARTED = 'STARTED',
    CLOSE = 'CLOSED',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}
export enum Role {
    ADMIN = 'ADMIN',
    TECH = "TECH",
    USER = 'USER',
}



export interface UserFire {
    id: string;
    name: string;
    username?: string;
    password?: string;
    role: Role;
    assignedTickets?: TicketFire[];
}

export interface TicketFire {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    assignedToUserId?: number | null;
    assignedToUser?: UserFire | null;
}
