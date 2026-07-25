import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";

export default function Dashboard() {
  const { session } = useDashboardAuth();
  const firstName = session?.user.name.split(" ")[0] ?? "";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-gray-500">Here's where {session?.business.name} stands today.</p>
      </div>

      <div className="mb-6 flex flex-col gap-5 rounded-2xl bg-gradient-to-br from-gray-900 to-[#1D3555] p-7 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
            Growth Blueprint
          </p>
          <h2 className="mb-2 text-lg font-bold">Your business is ready for its first growth plan.</h2>
          <p className="mb-4 text-sm text-gray-300">
            Answer a few questions about your business and our team will put together a
            personalized growth plan — free.
          </p>
          <Link
            to="/growth-blueprint"
            className="inline-block rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Start Growth Blueprint →
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Get your store ready</h3>

        <div className="space-y-0.5">
          <div className="flex items-center gap-3 border-b border-gray-100 py-3">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
            <span className="flex-1 text-sm text-gray-400 line-through">Create your account</span>
          </div>
          <div className="flex items-center gap-3 border-b border-gray-100 py-3">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
            <span className="flex-1 text-sm text-gray-400 line-through">Set up your business profile</span>
          </div>
          <div className="flex items-center gap-3 border-b border-gray-100 py-3">
            <Circle size={18} className="shrink-0 text-gray-300" />
            <span className="flex-1 text-sm text-gray-700">Run your Growth Blueprint</span>
            <Link to="/growth-blueprint" className="text-xs font-semibold text-orange-500 hover:text-orange-600">
              Start →
            </Link>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Circle size={18} className="shrink-0 text-gray-300" />
            <span className="flex-1 text-sm text-gray-400">Add your first product</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400">Soon</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
