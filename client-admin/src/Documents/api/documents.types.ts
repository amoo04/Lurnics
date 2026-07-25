export interface Document {
  id: string;
  clientId: string | null;
  projectId: string | null;
  documentName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  client?: { id: string; companyName: string } | null;
  project?: { id: string; projectName: string } | null;
  uploader?: { id: string; name: string } | null;
}

export interface CreateDocumentInput {
  documentName: string;
  fileUrl: string;
  fileType: string;
  clientId?: string;
  projectId?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
