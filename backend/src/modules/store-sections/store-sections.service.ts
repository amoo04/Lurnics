import { NotFoundError, ValidationError } from "../../middleware/error.js";
import {
  findSectionById,
  findSections,
  setSectionOrder,
  updateSection,
} from "./store-sections.repository.js";
import type { ReorderSectionsInput, UpdateSectionInput } from "./store-sections.schema.js";

function parseContent(row: { content: string }) {
  try {
    return JSON.parse(row.content) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function withParsedContent<T extends { content: string }>(row: T) {
  return { ...row, content: parseContent(row) };
}

export async function listSections(businessId: string) {
  const rows = await findSections(businessId);
  return rows.map(withParsedContent);
}

export async function getSection(businessId: string, id: string) {
  const row = await findSectionById(businessId, id);
  if (!row) throw new NotFoundError("Section not found");
  return withParsedContent(row);
}

export async function editSection(businessId: string, id: string, input: UpdateSectionInput) {
  await getSection(businessId, id);

  const patch: { visible?: boolean; content?: string } = {};
  if (input.visible !== undefined) patch.visible = input.visible;
  if (input.content !== undefined) patch.content = JSON.stringify(input.content);

  const row = await updateSection(businessId, id, patch);
  return withParsedContent(row);
}

export async function reorderSections(businessId: string, input: ReorderSectionsInput) {
  for (const [index, id] of input.orderedIds.entries()) {
    const section = await findSectionById(businessId, id);
    if (!section) throw new ValidationError(`Section ${id} not found`);
    await setSectionOrder(businessId, id, index);
  }
  return listSections(businessId);
}
