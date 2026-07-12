import { findIntegrations, upsertIntegration } from "./integrations.repository.js";
import type { UpdateIntegrationInput } from "./integrations.schema.js";

export async function listIntegrations() {
  return findIntegrations();
}

export async function updateIntegration(key: string, input: UpdateIntegrationInput) {
  return upsertIntegration(key, input);
}
