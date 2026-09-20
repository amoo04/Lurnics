import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { navMenuItems, type NewNavMenuItemRow } from "../../db/schema.js";

export function defaultNavItems(businessId: string): NewNavMenuItemRow[] {
  return [
    { businessId, location: "main", label: "Home", linkType: "home", sortOrder: 0 },
    { businessId, location: "main", label: "Shop", linkType: "shop", sortOrder: 1 },
  ];
}

export async function createItems(rows: NewNavMenuItemRow[]) {
  await db.insert(navMenuItems).values(rows);
}

export async function createItem(input: NewNavMenuItemRow) {
  const [row] = await db.insert(navMenuItems).values(input).returning();
  return row;
}

export async function findItems(businessId: string, location: string) {
  return db.query.navMenuItems.findMany({
    where: and(eq(navMenuItems.businessId, businessId), eq(navMenuItems.location, location)),
    orderBy: asc(navMenuItems.sortOrder),
  });
}

export async function findVisibleItems(businessId: string, location: string) {
  return db.query.navMenuItems.findMany({
    where: and(
      eq(navMenuItems.businessId, businessId),
      eq(navMenuItems.location, location),
      eq(navMenuItems.isVisible, true),
    ),
    orderBy: asc(navMenuItems.sortOrder),
  });
}

export async function findItemById(businessId: string, id: string) {
  return db.query.navMenuItems.findFirst({
    where: and(eq(navMenuItems.businessId, businessId), eq(navMenuItems.id, id)),
  });
}

export async function updateItem(businessId: string, id: string, patch: Partial<NewNavMenuItemRow>) {
  const [row] = await db
    .update(navMenuItems)
    .set(patch)
    .where(and(eq(navMenuItems.businessId, businessId), eq(navMenuItems.id, id)))
    .returning();
  return row;
}

export async function deleteItem(businessId: string, id: string) {
  await db.delete(navMenuItems).where(and(eq(navMenuItems.businessId, businessId), eq(navMenuItems.id, id)));
}

export async function setItemOrder(businessId: string, id: string, sortOrder: number) {
  await db
    .update(navMenuItems)
    .set({ sortOrder })
    .where(and(eq(navMenuItems.businessId, businessId), eq(navMenuItems.id, id)));
}
