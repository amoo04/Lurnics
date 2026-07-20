import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import SettingsNav from "../components/SettingsNav";
import SiteInformationForm from "../components/SiteInformationForm";
import ApplicationSettingsPanel from "../components/ApplicationSettingsPanel";
import SystemPreferencesPanel from "../components/SystemPreferencesPanel";
import StorageSettingsPanel from "../components/StorageSettingsPanel";
import OtherSettingsPanel from "../components/OtherSettingsPanel";
import { useSettings, saveSettings } from "../hooks/useSettings";
import { DEFAULT_SETTINGS, type Settings } from "../api/settings.types";
import { ApiError } from "../../../lib/api";

type SaveStatus = "idle" | "submitting" | "success" | "error";

export default function Settings() {
  const { settings, loading, error, refetch } = useSettings();
  const [draft, setDraft] = useState<Settings>(DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setDraft({ ...DEFAULT_SETTINGS, ...settings });
    }
  }, [settings]);

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaveStatus("submitting");
    setSaveError(null);
    try {
      await saveSettings(draft);
      setSaveStatus("success");
      refetch();
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof ApiError ? err.message : "Failed to save settings");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Settings"
          breadcrumb={["Home", "Settings"]}
          action={
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || saveStatus === "submitting"}
                className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
              >
                <Save size={16} />
                {saveStatus === "submitting" ? "Saving…" : "Save Changes"}
              </button>
              {saveStatus === "success" && <p className="text-xs text-green-600">Settings saved</p>}
              {saveStatus === "error" && <p className="text-xs text-red-500">{saveError}</p>}
            </div>
          }
        />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <SettingsNav />

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-lg font-semibold text-gray-900">General Settings</p>
            <p className="mb-5 text-sm text-gray-500">
              Manage your application preferences and configuration
            </p>

            {loading && <p className="text-sm text-gray-500">Loading settings…</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <SiteInformationForm values={draft} onChange={updateField} />
                  <SystemPreferencesPanel values={draft} onChange={updateField} />
                </div>
                <div className="space-y-6">
                  <ApplicationSettingsPanel values={draft} onChange={updateField} />
                  <StorageSettingsPanel values={draft} onChange={updateField} />
                  <OtherSettingsPanel values={draft} onChange={updateField} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
