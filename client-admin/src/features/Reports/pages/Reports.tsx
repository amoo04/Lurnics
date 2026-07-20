import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import RevenueReportCard from "../components/RevenueReportCard";
import ProjectsReportCard from "../components/ProjectsReportCard";
import InvoicesReportCard from "../components/InvoicesReportCard";
import DocumentsReportCard from "../components/DocumentsReportCard";

export default function Reports() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader title="Reports" subtitle="Business performance across revenue, projects, invoices, and documents." />

        <div className="grid gap-6 px-4 pb-8 sm:px-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <RevenueReportCard />
          </div>
          <ProjectsReportCard />
          <InvoicesReportCard />
          <div className="md:col-span-2">
            <DocumentsReportCard />
          </div>
        </div>
      </div>
    </div>
  );
}
