import { useSearchParams, Link } from "react-router-dom";
import { Hammer } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

export default function ComingSoon() {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get("feature") ?? "This feature";

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Hammer size={20} />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-gray-900">{feature} isn't built yet</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          This is on the roadmap but doesn't exist in the platform yet — no data, no backend, nothing faked here.
        </p>
        <Link
          to="/portal"
          className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
