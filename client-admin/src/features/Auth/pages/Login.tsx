import logo from "../../../assets/logo/logo3.png";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="h-10 w-[175px] overflow-hidden">
            <img src={logo} alt="Lurnics" className="h-10 w-[175px] object-cover" />
          </div>
          <p className="mt-2 text-sm text-gray-400">Admin Portal</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="mb-1 text-lg font-semibold text-white">Sign in</h1>
          <p className="mb-6 text-sm text-gray-400">Sign in to access the Lurnics admin dashboard.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
