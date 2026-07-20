import { and, asc, desc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { messages, type NewMessageRow } from "../../db/schema.js";

export async function findClientMessages() {
  return db.query.messages.findMany({
    where: isNotNull(messages.clientId),
    orderBy: desc(messages.createdAt),
    with: { client: true, sender: { columns: { passwordHash: false } } },
  });
}

export async function findMessagesForClient(clientId: string) {
  return db.query.messages.findMany({
    where: eq(messages.clientId, clientId),
    orderBy: asc(messages.createdAt),
    with: { sender: { columns: { passwordHash: false } } },
  });
}

export async function createClientMessage(senderId: string, clientId: string, message: string) {
  const [row] = await db
    .insert(messages)
    .values({ senderId, clientId, message })
    .returning();
  return row;
}

export async function markClientMessagesRead(clientId: string) {
  await db
    .update(messages)
    .set({ readStatus: true })
    .where(eq(messages.clientId, clientId));
}

export async function findMessagesForUser(userId: string) {
  return db.query.messages.findMany({
    where: and(isNull(messages.clientId), or(eq(messages.senderId, userId), eq(messages.receiverId, userId))),
    orderBy: desc(messages.createdAt),
    with: {
      sender: { columns: { passwordHash: false } },
      receiver: { columns: { passwordHash: false } },
    },
  });
}

export async function findConversation(userId: string, counterpartId: string) {
  return db.query.messages.findMany({
    where: or(
      and(eq(messages.senderId, userId), eq(messages.receiverId, counterpartId)),
      and(eq(messages.senderId, counterpartId), eq(messages.receiverId, userId)),
    ),
    orderBy: asc(messages.createdAt),
  });
}

export async function createMessage(input: NewMessageRow) {
  const [row] = await db.insert(messages).values(input).returning();
  return row;
}

export async function markConversationRead(userId: string, counterpartId: string) {
  await db
    .update(messages)
    .set({ readStatus: true })
    .where(and(eq(messages.senderId, counterpartId), eq(messages.receiverId, userId)));
}
