import { Hono } from "hono";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { AppError, ValidationError } from "../../middleware/error.js";
import { getR2, r2Bucket, r2PublicUrl } from "../../lib/r2.js";

export const uploadsRoutes = new Hono<AppEnv>();

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

uploadsRoutes.post("/image", authenticate(), requirePermission("documents:write"), async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"];

  if (!(file instanceof File)) {
    throw new ValidationError("No file provided");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError("Unsupported file type. Use JPEG, PNG, WebP, or GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError("File too large. Max 5MB.");
  }

  const bucket = r2Bucket();
  if (!bucket) {
    throw new AppError("File storage is not configured on the server yet", 503, "STORAGE_NOT_CONFIGURED");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const key = `uploads/${crypto.randomUUID()}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  try {
    await getR2().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );
  } catch (err) {
    throw new AppError(err instanceof Error ? err.message : "Failed to upload file", 502, "UPLOAD_FAILED");
  }

  return c.json({ success: true, data: { url: r2PublicUrl(key) } }, 201);
});
