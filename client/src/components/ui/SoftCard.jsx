const ACCENTS = {
  default: { border: "", blob: "bg-gradient-to-br from-sky-400/15 via-fuchsia-400/10 to-amber-300/15" },
  sky: { border: "border-l-[5px] border-l-sky-400/90", blob: "from-sky-400/25 to-cyan-400/10" },
  cyan: { border: "border-l-[5px] border-l-cyan-400/90", blob: "from-cyan-400/25 to-blue-500/10" },
  coral: { border: "border-l-[5px] border-l-rose-400/90", blob: "from-rose-400/25 to-orange-300/10" },
  rose: { border: "border-l-[5px] border-l-rose-400/90", blob: "from-rose-400/25 to-fuchsia-400/10" },
  lavender: { border: "border-l-[5px] border-l-violet-400/90", blob: "from-violet-400/25 to-fuchsia-400/10" },
  sunshine: { border: "border-l-[5px] border-l-amber-400/90", blob: "from-amber-400/25 to-yellow-300/10" },
  mint: { border: "border-l-[5px] border-l-teal-400/90", blob: "from-teal-400/25 to-emerald-400/10" },
  berry: { border: "border-l-[5px] border-l-pink-400/90", blob: "from-pink-400/25 to-rose-400/10" },
};

export default function SoftCard({ children, className = "", accent = "default" }) {
  const a = ACCENTS[accent] || ACCENTS.default;
  const blobClass = accent === "default" ? a.blob : `bg-gradient-to-br ${a.blob}`;

  return (
    <section className={`leaf-card relative overflow-hidden p-5 font-sans sm:p-6 ${a.border} ${className}`}>
      <div
        className={`pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full blur-3xl ${blobClass}`}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
