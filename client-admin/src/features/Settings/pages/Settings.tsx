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

export default function Settings() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Settings"
          breadcrumb={["Home", "Settings"]}
          action={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Save size={16} />
              Save Changes
            </button>
          }
        />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <SettingsNav />

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-lg font-semibold">General Settings</p>
            <p className="mb-5 text-sm text-gray-400">
              Manage your application preferences and configuration
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <SiteInformationForm />
                <SystemPreferencesPanel />
              </div>
              <div className="space-y-6">
                <ApplicationSettingsPanel />
                <StorageSettingsPanel />
                <OtherSettingsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
