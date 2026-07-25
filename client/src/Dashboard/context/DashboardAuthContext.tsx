import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet, apiPatch, apiPost } from "../../lib/api";
import type { DashboardBusiness, DashboardSession, PlatformLoginInput, RegisterBusinessInput } from "../api/dashboard.types";

interface DashboardAuthContextValue {
  session: DashboardSession | null;
  loading: boolean;
  registerBusiness: (input: RegisterBusinessInput) => Promise<void>;
  login: (input: PlatformLoginInput) => Promise<void>;
  logout: () => Promise<void>;
  updateBusinessSettings: (patch: { theme?: string; customDomain?: string | null }) => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DashboardSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<DashboardSession>("/api/platform/auth/me")
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  async function registerBusiness(input: RegisterBusinessInput) {
    const result = await apiPost<DashboardSession>("/api/platform/auth/register", input);
    setSession(result);
  }

  async function login(input: PlatformLoginInput) {
    const result = await apiPost<DashboardSession>("/api/platform/auth/login", input);
    setSession(result);
  }

  async function logout() {
    try {
      await apiPost("/api/platform/auth/logout");
    } catch {
      // ignore — clear local state regardless
    }
    setSession(null);
  }

  async function updateBusinessSettings(patch: { theme?: string; customDomain?: string | null }) {
    const business = await apiPatch<DashboardBusiness>("/api/platform/auth/business", patch);
    setSession((prev) => (prev ? { ...prev, business } : prev));
  }

  return (
    <DashboardAuthContext.Provider value={{ session, loading, registerBusiness, login, logout, updateBusinessSettings }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth(): DashboardAuthContextValue {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx) {
    throw new Error("useDashboardAuth must be used within a DashboardAuthProvider");
  }
  return ctx;
}
