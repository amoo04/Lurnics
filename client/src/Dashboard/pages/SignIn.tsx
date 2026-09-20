import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { ApiError } from "../../lib/api";

const inputClass =
  "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";
const fieldClass =
  "flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 focus-within:border-gray-900";

export default function SignIn() {
  const { login } = useDashboardAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/portal");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center">
          <span className="text-xl font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
          <span className="mt-1 h-0.5 w-8 bg-orange-500" />
          <p className="mt-2 text-sm text-gray-500">Business Portal</p>
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-gray-900">Sign in</h1>
          <p className="mb-6 text-sm text-gray-500">Sign in to manage your store.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-600">Email</label>
              <div className={fieldClass}>
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-600">Password</label>
              <div className={fieldClass}>
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-red-500">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have a store yet?{" "}
            <Link to="/signup" className="font-medium text-gray-900 hover:text-orange-500">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
