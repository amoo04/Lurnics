import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageHeader from "../../components/layout/PageHeader";
import GrowthBlueprintTable from "../components/GrowthBlueprintTable";
import GrowthBlueprintDetailPanel from "../components/GrowthBlueprintDetailPanel";
import { useGrowthBlueprintSubmissions } from "../hooks/useGrowthBlueprint";

export default function GrowthBlueprint() {
  const { data, loading, error } = useGrowthBlueprintSubmissions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const submissions = data?.items ?? [];
  const selected = submissions.find((s) => s.id === selectedId);

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Growth Blueprint"
          subtitle="Businesses that requested a free growth blueprint through the public site."
        />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <GrowthBlueprintTable
              submissions={submissions}
              loading={loading}
              error={error}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          {selected && <GrowthBlueprintDetailPanel submission={selected} />}
        </div>
      </div>
    </div>
  );
}
