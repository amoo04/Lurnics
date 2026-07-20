import { apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type {
  ClientConversation,
  InternalConversation,
  Message,
  Paginated,
  Ticket,
} from "../api/messages.types";

// ---- Client conversations ----

export function useConversations() {
  return useApiGet<ClientConversation[]>("/api/messages/conversations");
}

export function useConversationThread(clientId: string | undefined) {
  return useApiGet<Message[]>(clientId ? `/api/messages/conversations/client/${clientId}` : null);
}

export function sendClientMessage(clientId: string, message: string) {
  return apiPost<Message>(`/api/messages/conversations/client/${clientId}`, { message });
}

// ---- Internal (staff-to-staff) conversations ----

export function useInternalConversations() {
  return useApiGet<InternalConversation[]>("/api/messages/conversations/internal");
}

export function useInternalThread(userId: string | undefined) {
  return useApiGet<Message[]>(userId ? `/api/messages/conversations/internal/${userId}` : null);
}

export function sendInternalMessage(userId: string, message: string) {
  return apiPost<Message>(`/api/messages/conversations/internal/${userId}`, { message });
}

// ---- Tickets scoped to a client (used by ConversationDetailsPanel) ----

export function useClientTickets(clientId: string | undefined) {
  const query = buildQuery({ clientId, limit: 50 });
  return useApiGet<Paginated<Ticket>>(clientId ? `/api/tickets${query}` : null);
}

export function useTicketsCountByStatus(status: string) {
  const query = buildQuery({ status, limit: 1 });
  return useApiGet<Paginated<Ticket>>(`/api/tickets${query}`);
}
