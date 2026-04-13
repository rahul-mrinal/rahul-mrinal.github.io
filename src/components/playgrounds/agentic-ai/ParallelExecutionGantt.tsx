import { useEffect, useRef, useState } from "react";

const TASKS = [
  { id: "research", label: "Research", dur: 5 },
  { id: "code", label: "Code", dur: 8 },
  { id: "review", label: "Review", dur: 3 },
] as const;

const SEQ_TOTAL = 16;
const PAR_TOTAL = 8;
const SIM_MS = 50;
const SIM_STEP = 0.2;

const SEQ_STARTS = [0, 5, 13] as const;

type Mode = "seq" | "par" | null;

export default function ParallelExecutionGantt() {
  const [mode, setMode] = useState<Mode>(null);
  const [elapsed, setElapsed] = useState(0);
  const [seqDone, setSeqDone] = useState<number | null>(null);
  const [parDone, setParDone] = useState<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!mode) return;
    const cap = mode === "seq" ? SEQ_TOTAL : PAR_TOTAL;
    tickRef.current = setInterval(() => {
      setElapsed((t) => {
        const next = Math.min(cap, t + SIM_STEP);
        if (next >= cap && tickRef.current) {
          clearInterval(tickRef.current);
          tickRef.current = null;
          if (cap === SEQ_TOTAL) setSeqDone(cap);
          else setParDone(cap);
        }
        return next;
      });
    }, SIM_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [mode]);

  const start = (m: "seq" | "par") => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setElapsed(0);
    if (m === "seq") setSeqDone(null);
    else setParDone(null);
    setMode(m);
  };

  const scale = mode === "par" ? PAR_TOTAL : SEQ_TOTAL;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-text-secondary">Elapsed (sim)</span>
        <span className="text-accent font-mono text-lg">{elapsed.toFixed(1)}s</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => start("seq")}
          className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:brightness-110 transition"
        >
          Run Sequential
        </button>
        <button
          type="button"
          onClick={() => start("par")}
          className="px-3 py-2 rounded-lg border border-border text-text-secondary text-xs font-semibold hover:border-accent transition"
        >
          Run Parallel
        </button>
      </div>
      <div className="space-y-2">
        {TASKS.map((task, i) => {
          const startT = mode === "par" ? 0 : SEQ_STARTS[i];
          const fillFrac = !mode ? 0 : Math.max(0, Math.min(1, (elapsed - startT) / task.dur));
          const leftPct = mode === "par" ? 0 : (startT / scale) * 100;
          const widthPct = fillFrac * ((task.dur / scale) * 100);
          return (
            <div key={task.id} className="relative h-8 bg-[#0d0e14] border border-border rounded-lg overflow-hidden">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-xs text-text-secondary font-mono">
                {task.label} ({task.dur}s)
              </span>
              <div
                className="absolute inset-y-0 rounded-md bg-accent/80 transition-[width] duration-75 ease-linear border-r border-accent"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0d0e14] border border-border rounded-lg px-4 py-3">
          <span className="text-xs font-semibold text-text-secondary block mb-1">Sequential total</span>
          <span className="text-accent font-mono text-sm">{seqDone != null ? `${seqDone}s` : "-"}</span>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg px-4 py-3">
          <span className="text-xs font-semibold text-text-secondary block mb-1">Parallel total</span>
          <span className="text-accent font-mono text-sm">{parDone != null ? `${parDone}s` : "-"}</span>
        </div>
      </div>
    </div>
  );
}
