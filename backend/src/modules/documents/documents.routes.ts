import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { createDocumentSchema, listDocumentsQuerySchema } from "./documents.schema.js";
import { addDocument, listDocuments, removeDocument } from "./documents.service.js";

export const documentsRoutes = new Hono<AppEnv>();

documentsRoutes.use("*", authenticate());

documentsRoutes.get("/", requirePermission("documents:read"), async (c) => {
  const parsed = listDocumentsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listDocuments(parsed.data);
  return c.json({ success: true, data: result });
});

documentsRoutes.post("/", requirePermission("documents:write"), async (c) => {
  const parsed = createDocumentSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid document payload", parsed.error.flatten().fieldErrors);
  }

  const document = await addDocument(c.get("userId"), parsed.data);
  return c.json({ success: true, data: document }, 201);
});

documentsRoutes.delete("/:id", requirePermission("documents:delete"), async (c) => {
  await removeDocument(c.req.param("id"));
  return c.json({ success: true, data: null });
});
