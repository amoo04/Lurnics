export interface RevenuePoint {
  month: string;
  total: number;
}

export interface ProjectsByStatusRow {
  status: string;
  count: number;
}

export interface InvoicesByStatusRow {
  status: string;
  count: number;
  total: number;
}

export interface DocumentsByTypeRow {
  fileType: string;
  count: number;
}

export interface DocumentsByClientRow {
  clientId: string;
  companyName: string;
  count: number;
}

export interface DocumentsReport {
  total: number;
  byType: DocumentsByTypeRow[];
  byClient: DocumentsByClientRow[];
  recentCount: number;
}
