export type CartStatus = "active" | "abandoned" | "recovered";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
}

export interface Cart {
  id: string;
  businessId: string;
  customerName: string | null;
  customerEmail: string;
  convertedOrderId: string | null;
  convertedAt: string | null;
  lastActivityAt: string;
  createdAt: string;
  items: CartItem[];
  value: number;
  status: CartStatus;
}

export interface CartListResult {
  items: Cart[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartStats {
  totalAbandonedCarts: number;
  recoveredOrders: number;
  recoveryRate: number;
  revenueRecovered: number;
  conversionValue: number;
}
