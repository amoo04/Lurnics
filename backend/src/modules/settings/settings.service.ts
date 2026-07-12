import { findSettings, upsertSettings } from "./settings.repository.js";
import type { UpdateSettingsInput } from "./settings.schema.js";

export async function getSettings() {
  const settings = await findSettings();
  return settings?.data ?? {};
}

export async function saveSettings(input: UpdateSettingsInput) {
  const settings = await upsertSettings(input);
  return settings.data;
}
