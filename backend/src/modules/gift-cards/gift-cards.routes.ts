import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import {
  createGiftCardSchema,
  listGiftCardsQuerySchema,
  redeemGiftCardSchema,
  updateGiftCardSchema,
} from "./gift-cards.schema.js";
import {
  editGiftCard,
  getGiftCard,
  getGiftCardStats,
  issueGiftCard,
  listGiftCards,
  redeemGiftCard,
  removeGiftCard,
} from "./gift-cards.service.js";

export const giftCardsRoutes = new Hono<AppEnv>();

giftCardsRoutes.use("*", authenticatePlatform());

giftCardsRoutes.post("/", async (c) => {
  const parsed = createGiftCardSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid gift card payload", parsed.error.flatten().fieldErrors);
  }

  const card = await issueGiftCard(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: card }, 201);
});

giftCardsRoutes.get("/stats", async (c) => {
  const stats = await getGiftCardStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

giftCardsRoutes.get("/", async (c) => {
  const parsed = listGiftCardsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listGiftCards(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

giftCardsRoutes.get("/:id", async (c) => {
  const card = await getGiftCard(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: card });
});

giftCardsRoutes.patch("/:id", async (c) => {
  const parsed = updateGiftCardSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid gift card payload", parsed.error.flatten().fieldErrors);
  }

  const card = await editGiftCard(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: card });
});

giftCardsRoutes.post("/:id/redeem", async (c) => {
  const parsed = redeemGiftCardSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid redeem payload", parsed.error.flatten().fieldErrors);
  }

  const card = await redeemGiftCard(c.get("businessId"), c.req.param("id"), parsed.data.amount);
  return c.json({ success: true, data: card });
});

giftCardsRoutes.delete("/:id", async (c) => {
  await removeGiftCard(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
