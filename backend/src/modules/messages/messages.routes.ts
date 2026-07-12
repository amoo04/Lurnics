import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate } from "../../middleware/auth.js";
import { sendClientMessageSchema, sendMessageSchema } from "./messages.schema.js";
import {
  getClientConversation,
  getConversation,
  listClientConversations,
  listConversations,
  sendClientMessage,
  sendMessage,
} from "./messages.service.js";

export const messagesRoutes = new Hono<AppEnv>();

messagesRoutes.use("*", authenticate());

messagesRoutes.get("/conversations", async (c) => {
  const conversations = await listClientConversations();
  return c.json({ success: true, data: conversations });
});

messagesRoutes.get("/conversations/client/:clientId", async (c) => {
  const thread = await getClientConversation(c.req.param("clientId"));
  return c.json({ success: true, data: thread });
});

messagesRoutes.post("/conversations/client/:clientId", async (c) => {
  const parsed = sendClientMessageSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid message payload", parsed.error.flatten().fieldErrors);
  }

  const message = await sendClientMessage(c.get("userId"), c.req.param("clientId"), parsed.data.message);
  return c.json({ success: true, data: message }, 201);
});

messagesRoutes.get("/conversations/internal", async (c) => {
  const conversations = await listConversations(c.get("userId"));
  return c.json({ success: true, data: conversations });
});

messagesRoutes.get("/conversations/internal/:userId", async (c) => {
  const thread = await getConversation(c.get("userId"), c.req.param("userId"));
  return c.json({ success: true, data: thread });
});

messagesRoutes.post("/conversations/internal/:userId", async (c) => {
  const parsed = sendMessageSchema.safeParse({
    receiverId: c.req.param("userId"),
    ...(await c.req.json()),
  });

  if (!parsed.success) {
    throw new ValidationError("Invalid message payload", parsed.error.flatten().fieldErrors);
  }

  const message = await sendMessage(c.get("userId"), parsed.data);
  return c.json({ success: true, data: message }, 201);
});
