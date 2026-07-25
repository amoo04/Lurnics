import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { storeSections, type NewStoreSectionRow } from "../../db/schema.js";

export const SECTION_TYPES = [
  "header",
  "announcement",
  "hero",
  "featured_collections",
  "featured_products",
  "testimonials",
  "newsletter",
  "footer",
] as const;

export function defaultSections(businessId: string, businessName: string): NewStoreSectionRow[] {
  const content: Record<(typeof SECTION_TYPES)[number], Record<string, unknown>> = {
    header: {},
    announcement: { message: `Welcome to ${businessName} — free shipping on your first order.` },
    hero: {
      eyebrow: "",
      headline: `Welcome to ${businessName}`,
      subtext: "",
      buttonText: "Shop Now",
      buttonLink: "/shop",
    },
    featured_collections: { heading: "Shop by Collection", limit: 4 },
    featured_products: { heading: "Featured Products", limit: 8 },
    testimonials: { heading: "What Our Customers Say", items: [] },
    newsletter: { heading: "Subscribe to our newsletter", subtext: "Get updates on new products and offers." },
    footer: { links: [], showSocialIcons: true },
  };

  return SECTION_TYPES.map((type, index) => ({
    businessId,
    type,
    sortOrder: index,
    visible: true,
    content: JSON.stringify(content[type]),
  }));
}

export async function createSections(rows: NewStoreSectionRow[]) {
  await db.insert(storeSections).values(rows);
}

export async function findSections(businessId: string) {
  return db.query.storeSections.findMany({
    where: eq(storeSections.businessId, businessId),
    orderBy: asc(storeSections.sortOrder),
  });
}

export async function findVisibleSections(businessId: string) {
  return db.query.storeSections.findMany({
    where: and(eq(storeSections.businessId, businessId), eq(storeSections.visible, true)),
    orderBy: asc(storeSections.sortOrder),
  });
}

export async function findSectionById(businessId: string, id: string) {
  return db.query.storeSections.findFirst({
    where: and(eq(storeSections.businessId, businessId), eq(storeSections.id, id)),
  });
}

export async function updateSection(businessId: string, id: string, patch: Partial<NewStoreSectionRow>) {
  const [row] = await db
    .update(storeSections)
    .set(patch)
    .where(and(eq(storeSections.businessId, businessId), eq(storeSections.id, id)))
    .returning();
  return row;
}

export async function setSectionOrder(businessId: string, id: string, sortOrder: number) {
  await db
    .update(storeSections)
    .set({ sortOrder })
    .where(and(eq(storeSections.businessId, businessId), eq(storeSections.id, id)));
}
