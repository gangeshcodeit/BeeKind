import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { token, user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (token) {
    return <Navigate to={user?.role === "teacher" ? "/teacher-dashboard" : "/dashboard"} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.data?.error || err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-transition relative min-h-screen overflow-hidden">
      <div
        className="login-bg-animate absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-forest-bg.png')" }}
      />
      <div className="floating-bee pointer-events-none absolute left-[8%] top-[16%] hidden text-[44px] opacity-95 drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)] md:block" aria-hidden="true">
        🐝
      </div>
      <div
        className="floating-bee pointer-events-none absolute right-[10%] top-[72%] hidden text-[48px] opacity-95 drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)] lg:block"
        style={{ animationDelay: "1.15s" }}
        aria-hidden="true"
      >
        🐝
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="relative w-full max-w-[560px]">
          <div className="fade-login-card mx-auto rounded-[28px] border border-white/35 bg-gradient-to-br from-[#1f5b2d]/72 via-[#2d6a2d]/64 to-[#1d5427]/68 px-7 pb-7 pt-7 shadow-[0_30px_70px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[14px] sm:px-8">
            <h1 className="text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
              Welcome to BeeKind
            </h1>
            <p className="mt-2 text-[clamp(1rem,3.5vw,1.35rem)] text-[#e3efd8]">Let's explore and protect nature together 🌿</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              {error && <p className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-50">{error}</p>}

              <label className="block">
                <span className="text-[clamp(1rem,3.6vw,1.45rem)] font-semibold text-white">Username</span>
                <input
                  className="mt-2 h-14 w-full rounded-full border border-white/20 bg-[#f6f1e8] px-6 text-[clamp(1rem,3.6vw,1.65rem)] text-[#313131] shadow-inner outline-none placeholder:text-[#a9a29a] focus:border-white/40 sm:h-[66px] sm:px-7"
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="text-[clamp(1rem,3.6vw,1.45rem)] font-semibold text-white">Password</span>
                <input
                  className="mt-2 h-14 w-full rounded-full border border-white/20 bg-[#f6f1e8] px-6 text-[clamp(1rem,3.6vw,1.65rem)] text-[#313131] shadow-inner outline-none placeholder:text-[#a9a29a] focus:border-white/40 sm:h-[66px] sm:px-7"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="mt-2 h-14 w-full rounded-full bg-gradient-to-r from-[#f7c54c] via-[#f8ba38] to-[#f3ad25] text-[clamp(1.05rem,3.8vw,1.95rem)] font-extrabold text-[#2f2f2f] shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition duration-200 hover:scale-[1.02] hover:brightness-105 sm:h-[66px] disabled:opacity-65"
              >
                {busy ? "Entering..." : "Enter the Hive 🐝"}
              </button>
            </form>

            <p className="mt-6 text-center text-[clamp(0.95rem,3.7vw,1.5rem)] text-[#e8efd9]">
              Not an eco guardian yet?{" "}
              <Link to="/register" state={location.state} className="font-bold text-[#f6d57e] underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
          <div
            className="floating-bee pointer-events-none absolute -bottom-6 -right-3 hidden text-[52px] drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)] sm:block"
            aria-hidden="true"
          >
            🐝
          </div>
        </div>
      </div>
    </div>
  );
}
