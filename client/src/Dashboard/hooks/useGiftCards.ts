import { apiDelete, apiGet, apiPost } from "../../lib/api";
import type { CreateGiftCardInput, GiftCard, GiftCardListResult, GiftCardStats } from "../api/gift-cards.types";

export function fetchGiftCards(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<GiftCardListResult>(`/api/platform/gift-cards${qs ? `?${qs}` : ""}`);
}

export function fetchGiftCardStats() {
  return apiGet<GiftCardStats>("/api/platform/gift-cards/stats");
}

export function createGiftCard(input: CreateGiftCardInput) {
  return apiPost<GiftCard>("/api/platform/gift-cards", input);
}

export function redeemGiftCard(id: string, amount: number) {
  return apiPost<GiftCard>(`/api/platform/gift-cards/${id}/redeem`, { amount });
}

export function deleteGiftCard(id: string) {
  return apiDelete<null>(`/api/platform/gift-cards/${id}`);
}
