import {
  createClientMessage,
  createMessage,
  findClientMessages,
  findConversation,
  findMessagesForClient,
  findMessagesForUser,
  markClientMessagesRead,
  markConversationRead,
} from "./messages.repository.js";
import type { SendMessageInput } from "./messages.schema.js";

export async function listClientConversations() {
  const all = await findClientMessages();

  const conversations = new Map<
    string,
    { clientId: string; client: unknown; lastMessage: (typeof all)[number]; unread: number }
  >();

  for (const message of all) {
    const clientId = message.clientId as string;

    if (!conversations.has(clientId)) {
      conversations.set(clientId, { clientId, client: message.client, lastMessage: message, unread: 0 });
    }

    if (!message.readStatus) {
      conversations.get(clientId)!.unread += 1;
    }
  }

  return Array.from(conversations.values());
}

export async function getClientConversation(clientId: string) {
  const thread = await findMessagesForClient(clientId);
  await markClientMessagesRead(clientId);
  return thread;
}

export async function sendClientMessage(senderId: string, clientId: string, message: string) {
  return createClientMessage(senderId, clientId, message);
}

export async function listConversations(userId: string) {
  const all = await findMessagesForUser(userId);

  const conversations = new Map<
    string,
    { counterpartId: string; counterpart: unknown; lastMessage: (typeof all)[number]; unread: number }
  >();

  for (const message of all) {
    const isSender = message.senderId === userId;
    const counterpartId = (isSender ? message.receiverId : message.senderId) as string;
    const counterpart = isSender ? message.receiver : message.sender;

    if (!conversations.has(counterpartId)) {
      conversations.set(counterpartId, { counterpartId, counterpart, lastMessage: message, unread: 0 });
    }

    if (!isSender && !message.readStatus) {
      conversations.get(counterpartId)!.unread += 1;
    }
  }

  return Array.from(conversations.values());
}

export async function getConversation(userId: string, counterpartId: string) {
  const thread = await findConversation(userId, counterpartId);
  await markConversationRead(userId, counterpartId);
  return thread;
}

export async function sendMessage(senderId: string, input: SendMessageInput) {
  return createMessage({ senderId, ...input });
}
