import { useState, type ReactNode } from "react";

const TABS = ["Direct", "Broadcast", "SharedState", "PubSub", "Streaming"] as const;
const DATA: Record<(typeof TABS)[number], { used: string[]; pros: string[]; cons: string[]; diagram: ReactNode }> = {
  Direct: {
    used: ["Handoff", "Debate"],
    pros: ["Low latency", "Clear ownership"],
    cons: ["Single path risk", "No fan-out"],
    diagram: (
      <div className="relative h-28 flex items-center justify-center gap-8">
        <div className="w-10 h-10 rounded border border-border bg-[#0d0e14] text-[10px] flex items-center justify-center font-bold">A</div>
        <div className="relative flex items-center">
          <div className="w-16 h-0 border-t-2 border-accent" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-[9px] text-accent">msg</span>
        </div>
        <div className="w-10 h-10 rounded border border-border bg-[#0d0e14] text-[10px] flex items-center justify-center font-bold">B</div>
      </div>
    ),
  },
  Broadcast: {
    used: ["Alerts", "Fan-out tasks"],
    pros: ["One write many read", "Simple source"],
    cons: ["No backpressure", "Noise to all"],
    diagram: (
      <div className="flex flex-col items-center gap-2 h-28 justify-center">
        <div className="w-10 h-8 rounded border border-accent text-[10px] flex items-center justify-center">Src</div>
        <div className="flex gap-1 w-full justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1 max-w-[48px]">
              <div className="w-0 h-4 border-l border-dashed border-border" />
              <div className="w-7 h-7 rounded border border-border bg-[#0d0e14] text-[9px] flex items-center justify-center">R{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  SharedState: {
    used: ["Blackboard", "CRDT agents"],
    pros: ["Shared truth", "Loose coupling"],
    cons: ["Contention", "Merge rules"],
    diagram: (
      <div className="relative h-28 w-full max-w-xs mx-auto">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 rounded border-2 border-accent bg-[#0d0e14] text-[10px] flex items-center justify-center font-semibold">State</div>
        {["tl", "tr", "bl", "br"].map((p, i) => (
          <div
            key={p}
            className={`absolute w-7 h-7 rounded border border-border bg-[#0d0e14] text-[9px] flex items-center justify-center ${p === "tl" ? "left-0 top-0" : p === "tr" ? "right-0 top-0" : p === "bl" ? "left-0 bottom-0" : "right-0 bottom-0"}`}
          >
            A{i + 1}
          </div>
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          <line x1="50%" y1="50%" x2="12%" y2="12%" stroke="#2e3345" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="88%" y2="12%" stroke="#2e3345" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="12%" y2="88%" stroke="#2e3345" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="88%" y2="88%" stroke="#2e3345" strokeWidth="1" />
        </svg>
      </div>
    ),
  },
  PubSub: {
    used: ["Event buses", "Plugin hooks"],
    pros: ["Decoupled", "Dynamic subs"],
    cons: ["Ordering", "Debug trace"],
    diagram: (
      <div className="flex items-center justify-center gap-2 h-28 flex-wrap">
        <div className="w-9 h-9 rounded border border-border text-[9px] flex items-center justify-center">Pub</div>
        <div className="w-8 h-0 border-t border-accent" />
        <div className="px-2 py-3 rounded border-2 border-accent bg-[#0d0e14] text-[10px]">Topic</div>
        <div className="flex flex-col gap-1">
          {["S1", "S2", "S3"].map((s) => (
            <div key={s} className="flex items-center">
              <div className="w-6 h-0 border-t border-dashed border-border" />
              <div className="w-7 h-6 rounded border border-border text-[9px] flex items-center justify-center">{s}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  Streaming: {
    used: ["Token APIs", "Live copilots"],
    pros: ["Progressive UX", "Early cancel"],
    cons: ["Partial coherence", "Buffering"],
    diagram: (
      <div className="flex items-center justify-center gap-3 h-28">
        <div className="w-9 h-9 rounded border border-border text-[9px] flex items-center justify-center">A</div>
        <div className="flex items-center gap-0.5 border border-border rounded px-1 py-0.5 bg-[#0d0e14]">
          {["tok", "…", "tok", "…", "tok"].map((t, j) => (
            <span key={j} className="text-[8px] text-accent animate-pulse" style={{ animationDelay: `${j * 150}ms` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="w-9 h-9 rounded border border-border text-[9px] flex items-center justify-center">B</div>
      </div>
    ),
  },
};

export default function CommPatternSwitcher() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Direct");
  const d = DATA[tab];
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-3 space-y-2">
      <div className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-2 py-1 text-[10px] rounded border ${tab === t ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-[120px] border border-border rounded bg-black/20 flex items-center justify-center p-2">{d.diagram}</div>
      <div className="text-xs font-semibold text-accent">{tab}</div>
      <div className="grid sm:grid-cols-3 gap-2 text-[10px]">
        <ul className="list-disc pl-3 text-text-secondary">
          {d.used.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <ul className="list-disc pl-3 text-emerald-400/90">
          {d.pros.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <ul className="list-disc pl-3 text-red-400/80">
          {d.cons.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
