import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDashboardAuth } from "../context/DashboardAuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useDashboardAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-500">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
