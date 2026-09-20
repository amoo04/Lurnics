import { Download } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageHeader from "../../components/layout/PageHeader";
import AnalyticsStats from "../components/AnalyticsStats";
import TrafficChart from "../components/TrafficChart";
import TrafficSourcesDonut from "../components/TrafficSourcesDonut";
import ConversionFunnel from "../components/ConversionFunnel";
import TopServicesTable from "../components/TopServicesTable";

export default function Analytics() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Analytics"
          subtitle="Track lead generation, sources, and conversion performance."
          action={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              <Download size={16} />
              Export Report
            </button>
          }
        />
        <AnalyticsStats />

        <div className="flex flex-col gap-6 px-4 pb-6 sm:px-8 lg:flex-row">
          <TrafficChart />
          <TrafficSourcesDonut />
        </div>

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <ConversionFunnel />
          <TopServicesTable />
        </div>
      </div>
    </div>
  );
}
