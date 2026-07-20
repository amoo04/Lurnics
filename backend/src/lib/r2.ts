import { S3Client } from "@aws-sdk/client-s3";
import { getBindings } from "./env.js";

let client: S3Client | null = null;

export function getR2(): S3Client {
  if (!client) {
    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = getBindings();
    client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: R2_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return client;
}

export function r2Bucket(): string {
  return getBindings().R2_BUCKET ?? "";
}

export function r2PublicUrl(key: string): string {
  const base = getBindings().R2_PUBLIC_URL ?? "";
  return `${base.replace(/\/$/, "")}/${key}`;
}
