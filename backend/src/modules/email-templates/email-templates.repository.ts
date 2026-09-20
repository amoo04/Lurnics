import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { emailTemplates } from "../../db/schema.js";

export async function findTemplates(category: string | undefined) {
  if (category && category !== "all") {
    return db.query.emailTemplates.findMany({ where: eq(emailTemplates.category, category) });
  }
  return db.query.emailTemplates.findMany();
}

export async function findTemplateById(id: string) {
  return db.query.emailTemplates.findFirst({ where: eq(emailTemplates.id, id) });
}
