import { getBindings } from "./env.js";

export function r2Bucket() {
  return getBindings().BUCKET;
}
