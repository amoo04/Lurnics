export interface StaffUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface ClientSummary {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  industry: string | null;
  status: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string | null;
  clientId: string | null;
  message: string;
  readStatus: boolean;
  createdAt: string;
  sender?: StaffUser;
  receiver?: StaffUser;
}

export interface ClientConversation {
  clientId: string;
  client: ClientSummary;
  lastMessage: Message;
  unread: number;
}

export interface InternalConversation {
  counterpartId: string;
  counterpart: StaffUser;
  lastMessage: Message;
  unread: number;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  id: string;
  clientId: string;
  projectId: string | null;
  subject: string;
  description: string;
  priority: string;
  status: TicketStatus;
  assignedTo: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
