export interface ProjectClient {
  id: string;
  companyName: string;
}

export interface Project {
  id: string;
  clientId: string;
  projectName: string;
  slug: string;
  description: string | null;
  projectType: string;
  status: string;
  progress: number;
  budget: number | null;
  startDate: string | null;
  dueDate: string | null;
  deploymentStatus: string;
  createdAt: string;
  updatedAt: string | null;
  client?: ProjectClient | null;
}

export interface CreateProjectInput {
  clientId: string;
  projectName: string;
  slug: string;
  description?: string;
  projectType: string;
  status: string;
  progress?: number;
  budget?: number;
  startDate?: string;
  dueDate?: string;
}

export const PROJECT_STATUSES = ["discovery", "development", "testing", "deployment", "completed"] as const;

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
