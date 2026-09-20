export type ProductStoredStatus = "active" | "draft";
export type ProductFilterStatus = "active" | "draft" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  type: string;
  collections: string | null;
  imageUrl: string | null;
  status: ProductStoredStatus;
  createdAt: string;
}

export interface ProductListResult {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  inventoryValue: number;
}

export interface InventoryStats {
  totalProducts: number;
  inventoryValue: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

export interface CreateProductInput {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  type?: string;
  collections?: string;
  imageUrl?: string;
  status?: ProductStoredStatus;
}

export type UpdateProductInput = Partial<CreateProductInput>;
