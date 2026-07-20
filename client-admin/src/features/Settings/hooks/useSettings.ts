import { apiPut } from "../../../lib/api";
import { useApiGet } from "../../../lib/useApi";
import type { Settings } from "../api/settings.types";

export function useSettings() {
  const { data: settings, loading, error, refetch } = useApiGet<Settings>("/api/settings");
  return { settings, loading, error, refetch };
}

export function saveSettings(values: Partial<Settings>) {
  return apiPut<Settings>("/api/settings", values);
}
