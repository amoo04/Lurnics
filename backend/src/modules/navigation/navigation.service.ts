import { NotFoundError, ValidationError } from "../../middleware/error.js";
import {
  createItem,
  deleteItem,
  findItemById,
  findItems,
  setItemOrder,
  updateItem,
} from "./navigation.repository.js";
import type { CreateNavItemInput, UpdateNavItemInput } from "./navigation.schema.js";

export async function listNavItems(businessId: string, location: string) {
  return findItems(businessId, location);
}

export async function addNavItem(businessId: string, input: CreateNavItemInput) {
  return createItem({
    businessId,
    location: input.location ?? "main",
    label: input.label,
    linkType: input.linkType,
    targetSlug: input.targetSlug,
    customUrl: input.customUrl,
    isVisible: input.isVisible ?? true,
  });
}

export async function editNavItem(businessId: string, id: string, input: UpdateNavItemInput) {
  const existing = await findItemById(businessId, id);
  if (!existing) throw new NotFoundError("Navigation item not found");
  return updateItem(businessId, id, input);
}

export async function removeNavItem(businessId: string, id: string) {
  const existing = await findItemById(businessId, id);
  if (!existing) throw new NotFoundError("Navigation item not found");
  await deleteItem(businessId, id);
}

export async function reorderNavItems(businessId: string, location: string, orderedIds: string[]) {
  for (const [index, id] of orderedIds.entries()) {
    const item = await findItemById(businessId, id);
    if (!item) throw new ValidationError(`Navigation item ${id} not found`);
    await setItemOrder(businessId, id, index);
  }
  return findItems(businessId, location);
}
