import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import DashboardStats from "../components/DashboardStats";
import RevenueChart from "../components/RevenueChart";
import ProjectsStatusDonut from "../components/ProjectsStatusDonut";
import RecentActivity from "../components/RecentActivity";
import RecentProjectsTable from "../components/RecentProjectsTable";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with Lurnics."
        />
        <DashboardStats />

        <div className="grid gap-6 px-4 sm:px-8 pb-6 md:grid-cols-[2fr_1fr_1fr]">
          <RevenueChart />
          <ProjectsStatusDonut />
          <RecentActivity />
        </div>

        <div className="grid gap-6 px-4 sm:px-8 pb-8 md:grid-cols-[2fr_1fr]">
          <RecentProjectsTable />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
