import { useMemo, useState } from "react";

const OPTIONS = [
  "God Agent",
  "Echo Chamber",
  "Infinite Loop",
  "Token Black Hole",
  "Premature Subagent",
  "Invisible Handoff",
] as const;

const DATA: { s: string; a: number; e: string }[] = [
  { s: "One agent has a 2000-word prompt handling 10 responsibilities", a: 0, e: "One overloaded agent owns too many concerns instead of narrow roles." },
  { s: "Critic always approves after round 1", a: 1, e: "Feedback loops that never disagree collapse into rubber-stamping." },
  { s: "Agent A→B→A delegation loop", a: 2, e: "Circular delegation without termination wastes steps and budget." },
  { s: "Manager ingests all worker outputs verbatim, hitting 128K", a: 3, e: "Summaries and deltas matter; raw fan-in explodes context." },
  { s: "Agent wraps a single API call with no reasoning", a: 4, e: "A subagent should earn its overhead with planning or policy." },
  { s: "User repeats info after every agent transfer", a: 5, e: "Handoffs need structured state so users are not the memory bus." },
];

export default function AntiPatternQuiz() {
  const [picked, setPicked] = useState<(number | null)[]>(() => DATA.map(() => null));
  const score = useMemo(() => picked.filter((p, i) => p === DATA[i].a).length, [picked]);
  const done = useMemo(() => picked.filter((p) => p !== null).length, [picked]);
  const pick = (i: number, o: number) =>
    setPicked((prev) => {
      const n = [...prev];
      if (n[i] === null) n[i] = o;
      return n;
    });
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-accent">Score</span>
        <span className="text-sm font-mono font-bold text-white">{score}/6</span>
        <div className="flex-1 min-w-[100px] h-2 rounded-full bg-[#0d0e14] border border-border overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${(done / 6) * 100}%` }} />
        </div>
      </div>
      {DATA.map((row, i) => {
        const p = picked[i];
        const ok = p !== null && p === row.a;
        return (
          <div key={i} className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
            <p className="text-sm text-white">{row.s}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {OPTIONS.map((label, j) => (
                <button
                  key={label}
                  type="button"
                  disabled={p !== null}
                  onClick={() => pick(i, j)}
                  className="text-[11px] py-1.5 px-2 rounded border border-border text-text-secondary hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
            {p !== null && (
              <div className={`text-xs border rounded px-2 py-1.5 ${ok ? "border-emerald-500/40 text-emerald-400" : "border-red-500/40 text-red-300"}`}>
                {ok ? "Correct." : "Incorrect."} {row.e}
                {!ok && <span className="text-text-secondary"> Expected: {OPTIONS[row.a]}.</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
