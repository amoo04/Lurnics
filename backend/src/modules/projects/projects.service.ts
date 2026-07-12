import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { logActivity } from "../activity-logs/activity-logs.service.js";
import {
  createProject,
  deleteProject,
  findProjectById,
  findProjectBySlug,
  findProjects,
  updateProject,
} from "./projects.repository.js";
import type { CreateProjectInput, UpdateProjectInput } from "./projects.schema.js";

export async function listProjects(query: {
  page?: string;
  limit?: string;
  status?: string;
  clientId?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findProjects(
    query.status,
    query.clientId,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function getProject(id: string) {
  const project = await findProjectById(id);
  if (!project) throw new NotFoundError("Project not found");
  return project;
}

export async function addProject(userId: string, input: CreateProjectInput) {
  const existing = await findProjectBySlug(input.slug);
  if (existing) throw new ConflictError("Project with this slug already exists");
  const project = await createProject({
    ...input,
    status: input.status,
    deploymentStatus: input.deploymentStatus ?? "pending",
  });
  await logActivity(userId, "create", "project", project.id);
  return project;
}

export async function editProject(userId: string, id: string, input: UpdateProjectInput) {
  await getProject(id);
  const project = await updateProject(id, input);
  await logActivity(userId, "update", "project", id);
  return project;
}

export async function removeProject(userId: string, id: string) {
  await getProject(id);
  await deleteProject(id);
  await logActivity(userId, "delete", "project", id);
}
