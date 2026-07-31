function PlayfulBackdrop({ hidden }) {
  if (hidden) return null;
  const items = [
    { emoji: "🍃", className: "animate-float-slow left-[4%] top-[10%] text-[clamp(1.75rem,4vw,2.75rem)]", delay: "0s" },
    { emoji: "🌸", className: "animate-float-slow right-[8%] top-[18%] text-[clamp(1.5rem,3.5vw,2.25rem)]", delay: "-1s" },
    { emoji: "🐝", className: "animate-float-slow left-[12%] bottom-[22%] text-[clamp(1.75rem,4vw,2.5rem)] opacity-90", delay: "-2.5s" },
    { emoji: "✨", className: "animate-float-slow right-[14%] bottom-[12%] text-[clamp(1.25rem,3vw,1.75rem)]", delay: "-3s" },
    { emoji: "🌿", className: "animate-float-slow left-[42%] top-[6%] hidden text-[clamp(1.25rem,3vw,1.85rem)] opacity-80 md:block", delay: "-1.8s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <span key={i} className={`absolute select-none ${item.className}`} style={{ animationDelay: item.delay }}>
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

export default function ForestPage({ children, className = "", contentClassName = "", fullBleed = false }) {
  return (
    <div className={`forest-bg relative min-h-screen ${className}`}>
      <PlayfulBackdrop hidden={fullBleed} />
      <div
        className={
          fullBleed ? "relative min-h-[100dvh] bg-transparent" : "relative honeycomb-cave min-h-screen bg-black/15"
        }
      >
        <div
          className={
            fullBleed
              ? `relative z-[1] min-h-[100dvh] w-full ${contentClassName}`.trim()
              : `relative z-[1] mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 ${contentClassName}`.trim()
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
