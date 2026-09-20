import { NotFoundError, ValidationError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createGiftCard,
  deleteGiftCard,
  findGiftCardByCode,
  findGiftCardById,
  findGiftCards,
  getGiftCardSummary,
  updateGiftCard,
} from "./gift-cards.repository.js";
import type { CreateGiftCardInput, UpdateGiftCardInput } from "./gift-cards.schema.js";

function randomSegment(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function generateUniqueCode(businessId: string): Promise<string> {
  let code = `GFT-${randomSegment()}-${randomSegment()}`;
  while (await findGiftCardByCode(businessId, code)) {
    code = `GFT-${randomSegment()}-${randomSegment()}`;
  }
  return code;
}

export function deriveGiftCardStatus(card: {
  balance: number;
  activatesAt: string | null;
  expiresAt: string | null;
}): "active" | "redeemed" | "scheduled" | "expired" {
  if (card.balance <= 0) return "redeemed";

  const now = new Date();
  if (card.activatesAt && now < new Date(card.activatesAt)) return "scheduled";
  if (card.expiresAt && now > new Date(card.expiresAt)) return "expired";

  return "active";
}

function withStatus<T extends { balance: number; activatesAt: string | null; expiresAt: string | null }>(card: T) {
  return { ...card, status: deriveGiftCardStatus(card) };
}

export async function issueGiftCard(businessId: string, input: CreateGiftCardInput) {
  const code = await generateUniqueCode(businessId);

  const card = await createGiftCard({
    businessId,
    code,
    type: input.type ?? "digital",
    initialValue: input.initialValue,
    balance: input.initialValue,
    recipientName: input.recipientName,
    recipientEmail: input.recipientEmail,
    message: input.message,
    activatesAt: input.activatesAt,
    expiresAt: input.expiresAt,
  });

  return withStatus(card);
}

export async function listGiftCards(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findGiftCards(
    businessId,
    query.status,
    query.search,
    pagination.limit,
    pagination.offset,
  );

  return paginatedResult(items.map(withStatus), total, pagination);
}

export async function getGiftCard(businessId: string, id: string) {
  const card = await findGiftCardById(businessId, id);
  if (!card) throw new NotFoundError("Gift card not found");
  return withStatus(card);
}

export async function editGiftCard(businessId: string, id: string, input: UpdateGiftCardInput) {
  await getGiftCard(businessId, id);
  const card = await updateGiftCard(businessId, id, input);
  return withStatus(card);
}

export async function removeGiftCard(businessId: string, id: string) {
  await getGiftCard(businessId, id);
  await deleteGiftCard(businessId, id);
}

export async function redeemGiftCard(businessId: string, id: string, amount: number) {
  const card = await getGiftCard(businessId, id);
  if (card.status !== "active") {
    throw new ValidationError(`Gift card is ${card.status}, cannot be redeemed`);
  }

  const redeemAmount = Math.min(amount, card.balance);
  const updated = await updateGiftCard(businessId, id, { balance: card.balance - redeemAmount });
  return withStatus(updated);
}

export async function getGiftCardStats(businessId: string) {
  const summary = await getGiftCardSummary(businessId);

  return {
    totalSales: summary?.totalSales ?? 0,
    totalSold: summary?.totalSold ?? 0,
    totalRedeemed: summary?.totalRedeemed ?? 0,
    outstandingBalance: summary?.outstandingBalance ?? 0,
  };
}
