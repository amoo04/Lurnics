export type PaymentStatus = "paid" | "pending" | "refunded";
export type FulfillmentStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  businessId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  channel: string;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  itemsCount: number;
  totalAmount: number;
  currency: string;
  notes: string | null;
  createdAt: string;
}

export interface OrderListResult {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Partial<Record<FulfillmentStatus, number>>;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail?: string;
  channel?: string;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  itemsCount?: number;
  totalAmount: number;
  notes?: string;
}
