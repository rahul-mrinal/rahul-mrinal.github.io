import { useCallback, useRef, useState } from "react";

const TASKS = [
  { id: "nlp", label: "NLP Analysis" },
  { id: "code", label: "Code Generation" },
  { id: "data", label: "Data Processing" },
  { id: "creative", label: "Creative Writing" },
] as const;

type Cap = { nlp: number; code: number; data: number; creative: number };

const AGENTS: { id: string; caps: Cap }[] = [
  { id: "LinguaBot", caps: { nlp: 90, code: 30, data: 50, creative: 40 } },
  { id: "CodeSmith", caps: { nlp: 35, code: 95, data: 70, creative: 15 } },
  { id: "DataCrunch", caps: { nlp: 45, code: 60, data: 92, creative: 20 } },
  { id: "Artisan", caps: { nlp: 55, code: 20, data: 25, creative: 88 } },
];

const noise = () => Math.floor(Math.random() * 11) - 5;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function AuctionSim() {
  const [task, setTask] = useState<(typeof TASKS)[number]["id"]>("nlp");
  const [bids, setBids] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const lock = useRef(false);

  const run = useCallback(async () => {
    if (lock.current) return;
    lock.current = true;
    setRunning(true);
    setWinner(null);
    setBids({});
    setLog([]);
    try {
      const finals = AGENTS.map((a) => ({ id: a.id, v: Math.max(0, Math.min(100, a.caps[task] + noise())) }));
      for (const { id, v } of finals) {
        const steps = 14;
        for (let s = 0; s <= steps; s++) {
          const cur = Math.round((v * s) / steps);
          setBids((b) => ({ ...b, [id]: cur }));
          await sleep(35);
        }
        setLog((l) => [...l, `${id} bid ${v}`]);
      }
      const w = finals.reduce((a, b) => (b.v > a.v ? b : a));
      setWinner(w.id);
      setLog((l) => [...l, `Winner: ${w.id} (${w.v})`]);
    } finally {
      lock.current = false;
      setRunning(false);
    }
  }, [task]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TASKS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTask(t.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              task === t.id ? "border-accent bg-[#6c63ff]/20 text-accent" : "border-border bg-[#0d0e14] text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {AGENTS.map((a) => (
          <div
            key={a.id}
            className={`rounded-lg border bg-[#0d0e14] p-2 ${
              winner === a.id ? "border-green-500 ring-1 ring-green-500/40" : "border-border"
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-accent">{a.id}</span>
              {winner === a.id && <span className="rounded bg-green-500/20 px-1.5 text-[10px] font-bold text-green-400">WINNER</span>}
            </div>
            <div className="text-lg font-mono text-white">{bids[a.id] ?? "-"}</div>
            {(Object.keys(a.caps) as (keyof Cap)[]).map((k) => (
              <div key={k} className="mt-1">
                <div className="flex justify-between text-[10px] text-text-secondary">
                  <span>{k}</span>
                  <span>{a.caps[k]}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#1a1c25]">
                  <div className="h-full rounded-full bg-[#6c63ff]" style={{ width: `${a.caps[k]}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void run()}
        disabled={running}
        className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
      >
        Run Auction
      </button>
      <div className="max-h-24 overflow-y-auto rounded-lg border border-border bg-[#0d0e14] p-2 font-mono text-[10px] text-accent">
        {log.map((line, i) => (
          <div key={i} className="text-text-secondary">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
