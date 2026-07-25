export type GiftCardKind = "digital" | "physical";
export type GiftCardStatus = "active" | "redeemed" | "scheduled" | "expired";

export interface GiftCard {
  id: string;
  businessId: string;
  code: string;
  type: GiftCardKind;
  initialValue: number;
  balance: number;
  recipientName: string | null;
  recipientEmail: string | null;
  message: string | null;
  activatesAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  status: GiftCardStatus;
}

export interface GiftCardListResult {
  items: GiftCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GiftCardStats {
  totalSales: number;
  totalSold: number;
  totalRedeemed: number;
  outstandingBalance: number;
}

export interface CreateGiftCardInput {
  type?: GiftCardKind;
  initialValue: number;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  activatesAt?: string;
  expiresAt?: string;
}
