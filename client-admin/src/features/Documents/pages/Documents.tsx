import { Upload, ChevronDown, FolderPlus, MoreHorizontal } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import DocumentsStats from "../components/DocumentsStats";
import DocumentsTable from "../components/DocumentsTable";
import StorageOverviewPanel from "../components/StorageOverviewPanel";
import QuickAccessPanel from "../components/QuickAccessPanel";
import RecentUploadsPanel from "../components/RecentUploadsPanel";

export default function Documents() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Documents"
          subtitle="Store, organize and manage all your important files."
          action={
            <div className="flex items-center gap-3">
              <button type="button" className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white">
                <Upload size={16} />
                Upload Document
                <ChevronDown size={14} />
              </button>
              <button type="button" className="flex items-center gap-1.5 rounded-md border border-white/10 px-4 py-2 text-sm text-gray-300">
                <FolderPlus size={14} />
                New Folder
              </button>
              <button type="button" className="rounded-md border border-white/10 px-3 py-2 text-gray-400">
                <MoreHorizontal size={16} />
              </button>
            </div>
          }
        />
        <DocumentsStats />

        <div className="grid gap-6 px-4 sm:px-8 pb-8 md:grid-cols-[2fr_320px]">
          <DocumentsTable />
          <div className="space-y-6">
            <StorageOverviewPanel />
            <QuickAccessPanel />
            <RecentUploadsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
