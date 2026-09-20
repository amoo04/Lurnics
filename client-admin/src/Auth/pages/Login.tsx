import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <span className="text-xl font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
          <span className="mt-1 h-0.5 w-8 bg-orange-500" />
          <p className="mt-2 text-sm text-gray-500">Admin Portal</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-gray-900">Sign in</h1>
          <p className="mb-6 text-sm text-gray-500">Sign in to access the Lurnics admin dashboard.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
