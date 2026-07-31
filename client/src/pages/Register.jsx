import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { token, user, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
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
      await register({ name, email, password, role });
    } catch (err) {
      setError(err.data?.error || err.message || "Registration failed");
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
        <div className="relative w-full max-w-[500px]">
          <div className="fade-login-card mx-auto rounded-[26px] border border-white/35 bg-gradient-to-br from-[#1f5b2d]/72 via-[#2d6a2d]/64 to-[#1d5427]/68 px-6 pb-6 pt-6 shadow-[0_28px_60px_rgba(0,0,0,0.33),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[14px] sm:px-7">
            <h1 className="text-[clamp(1.8rem,5.2vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
              Join BeeKind
            </h1>
            <p className="mt-1.5 text-[clamp(0.95rem,3vw,1.15rem)] text-[#e3efd8]">Create your eco guardian account 🌿</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {error && <p className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-50">{error}</p>}

              <label className="block">
                <span className="text-[clamp(0.95rem,3.1vw,1.2rem)] font-semibold text-white">Name</span>
                <input
                  className="mt-1.5 h-12 w-full rounded-full border border-white/20 bg-[#f6f1e8] px-5 text-[clamp(0.95rem,3vw,1.25rem)] text-[#313131] shadow-inner outline-none placeholder:text-[#a9a29a] focus:border-white/40 sm:h-[56px] sm:px-6"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-[clamp(0.95rem,3.1vw,1.2rem)] font-semibold text-white">Username</span>
                <input
                  className="mt-1.5 h-12 w-full rounded-full border border-white/20 bg-[#f6f1e8] px-5 text-[clamp(0.95rem,3vw,1.25rem)] text-[#313131] shadow-inner outline-none placeholder:text-[#a9a29a] focus:border-white/40 sm:h-[56px] sm:px-6"
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="text-[clamp(0.95rem,3.1vw,1.2rem)] font-semibold text-white">Password</span>
                <input
                  className="mt-1.5 h-12 w-full rounded-full border border-white/20 bg-[#f6f1e8] px-5 text-[clamp(0.95rem,3vw,1.25rem)] text-[#313131] shadow-inner outline-none placeholder:text-[#a9a29a] focus:border-white/40 sm:h-[56px] sm:px-6"
                  type="password"
                  placeholder="Create your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>

              <fieldset className="flex items-center gap-4 rounded-full bg-[#f6f1e8]/95 px-5 py-2.5">
                <legend className="sr-only">Role</legend>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2f2f2f]">
                  <input type="radio" name="role" checked={role === "student"} onChange={() => setRole("student")} />
                  Student
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2f2f2f]">
                  <input type="radio" name="role" checked={role === "teacher"} onChange={() => setRole("teacher")} />
                  Teacher
                </label>
              </fieldset>

              <button type="submit" disabled={busy} className="mt-1 h-12 w-full rounded-full bg-gradient-to-r from-[#f7c54c] via-[#f8ba38] to-[#f3ad25] text-[clamp(1rem,3.2vw,1.45rem)] font-extrabold text-[#2f2f2f] shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition duration-200 hover:scale-[1.02] hover:brightness-105 sm:h-[56px] disabled:opacity-65">
                {busy ? "Creating..." : "Create Account 🐝"}
              </button>
            </form>

            <p className="mt-5 text-center text-[clamp(0.9rem,3.1vw,1.15rem)] text-[#e8efd9]">
              Already an eco guardian?{" "}
              <Link to="/login" className="font-bold text-[#f6d57e] underline underline-offset-4">
                Log in
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
