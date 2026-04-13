import { useState, useMemo } from "react";

const PROPS = [
  "Autonomy",
  "Specialization",
  "Interaction",
  "Emergence",
  "Scalability",
] as const;

export default function MasPropertyToggle() {
  const [on, setOn] = useState<boolean[]>(() => PROPS.map(() => false));

  const count = useMemo(() => on.filter(Boolean).length, [on]);

  const summary = useMemo(() => {
    if (count === 0) return "Not MAS";
    if (count <= 2) return "Partial";
    if (count <= 4) return "Strong";
    return "Full MAS";
  }, [count]);

  const toggle = (i: number) => {
    setOn((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-semibold text-text-secondary">Active properties</div>
        <div className="text-sm font-bold text-accent font-mono">
          {count}/5
        </div>
      </div>
      <div className="h-2 rounded-full bg-black/40 border border-border overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${(count / 5) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PROPS.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => toggle(i)}
            className={`rounded-lg px-2 py-3 text-xs font-semibold border transition-colors ${
              on[i]
                ? "border-accent text-accent bg-[#0d0e14]"
                : "border-border text-text-secondary bg-[#0d0e14] hover:border-accent/50"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2 flex items-center justify-between gap-2">
        <span className="text-xs text-text-secondary">Profile</span>
        <span className="text-sm font-semibold text-accent">{summary}</span>
      </div>
    </div>
  );
}
