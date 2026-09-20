export type CollectionStatus = "active" | "inactive";

export interface Collection {
  id: string;
  businessId: string;
  name: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  status: CollectionStatus;
  createdAt: string;
  productCount: number;
}

export interface CollectionDetail extends Omit<Collection, "productCount"> {
  productIds: string[];
}

export interface CollectionListResult {
  items: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectionStats {
  totalCollections: number;
  activeCollections: number;
  productsInCollections: number;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  imageUrl?: string;
  status?: CollectionStatus;
  productIds?: string[];
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>;
