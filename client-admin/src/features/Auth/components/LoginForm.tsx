import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ApiError } from "../../../lib/api";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm text-gray-300">Email</label>
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5">
          <Mail size={16} className="text-gray-500" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lurnics.com"
            className="w-full bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-gray-300">Password</label>
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5">
          <Lock size={16} className="text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-500"
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-500">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-400">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
