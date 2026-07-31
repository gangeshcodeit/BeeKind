export default function BeeBuddy({ title = "Bee Buddy", message = "Buzz! You can do this!", className = "" }) {
  return (
    <div className={`leaf-card relative overflow-hidden p-4 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(250,204,21,0.12),transparent_55%)]" aria-hidden />
      <div className="relative flex items-start gap-3">
        <div className="relative grid h-[3.75rem] w-[3.75rem] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400 text-[2rem] shadow-[0_6px_0_#b45309,inset_0_2px_0_rgba(255,255,255,0.45)] ring-4 ring-amber-200/35">
          <span className="floating-bee leading-none drop-shadow-md">🐝</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display bg-gradient-to-r from-amber-100 to-sky-200 bg-clip-text text-lg font-bold text-transparent">
            {title}
          </p>
          <p className="mt-1 text-base font-semibold leading-snug text-violet-100/95">{message}</p>
        </div>
      </div>
    </div>
  );
}
