export type DiscountKind = "code" | "automatic";
export type DiscountValueType = "percentage" | "fixed_amount" | "free_shipping";
export type DiscountAppliesTo = "entire_order" | "shipping" | "specific_collections" | "specific_products";
export type DiscountStatus = "active" | "scheduled" | "expired" | "disabled";

export interface Discount {
  id: string;
  businessId: string;
  code: string;
  description: string | null;
  type: DiscountKind;
  discountType: DiscountValueType;
  value: number | null;
  appliesTo: DiscountAppliesTo;
  minOrderAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  status: DiscountStatus;
}

export interface DiscountListResult {
  items: Discount[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DiscountStats {
  totalDiscounts: number;
  activeDiscounts: number;
  codeDiscounts: number;
  automaticDiscounts: number;
  totalUses: number;
}

export interface CreateDiscountInput {
  code: string;
  description?: string;
  type?: DiscountKind;
  discountType?: DiscountValueType;
  value?: number;
  appliesTo?: DiscountAppliesTo;
  minOrderAmount?: number;
  usageLimit?: number;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
}

export type UpdateDiscountInput = Partial<CreateDiscountInput>;
