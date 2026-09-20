import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";

export default function Settings() {
  const { session } = useDashboardAuth();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Your account and business details.</p>
      </div>

      <div className="max-w-lg space-y-5">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Business</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{session?.business.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Store URL</dt>
              <dd className="font-medium text-gray-900">lurnics.com/{session?.business.slug}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Your account</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{session?.user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{session?.user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium capitalize text-gray-900">{session?.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
