import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  message: z.string().min(1),
});

export const sendClientMessageSchema = z.object({
  message: z.string().min(1),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SendClientMessageInput = z.infer<typeof sendClientMessageSchema>;
