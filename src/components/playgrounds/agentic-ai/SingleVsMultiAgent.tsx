import { useState, useRef, useCallback, useEffect } from "react";

const PHASES = ["Research", "Code", "Review"] as const;
const SINGLE_MS = 900;
const MULTI_MS = 950;
const SINGLE_TOTAL_S = (PHASES.length * SINGLE_MS) / 1000;
const MULTI_TOTAL_S = MULTI_MS / 1000;

function heatPct(p: number) {
  if (p < 35) return "bg-emerald-500";
  if (p < 65) return "bg-yellow-500";
  if (p < 85) return "bg-orange-500";
  return "bg-red-500";
}

export default function SingleVsMultiAgent() {
  const [running, setRunning] = useState(false);
  const [singlePhase, setSinglePhase] = useState(-1);
  const [singleCtx, setSingleCtx] = useState(0);
  const [multiCtx, setMultiCtx] = useState<[number, number, number]>([0, 0, 0]);
  const [singleTime, setSingleTime] = useState(0);
  const [multiTime, setMultiTime] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setRunning(false);
    setSinglePhase(-1);
    setSingleCtx(0);
    setMultiCtx([0, 0, 0]);
    setSingleTime(0);
    setMultiTime(0);
  }, [clearTimers]);

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const sendQuery = useCallback(() => {
    clearTimers();
    setRunning(true);
    setSinglePhase(0);
    setSingleCtx(0);
    setMultiCtx([0, 0, 0]);
    setSingleTime(0);
    setMultiTime(0);

    schedule(() => {
      setMultiCtx([32, 28, 30]);
    }, 30);
    schedule(() => {
      setMultiTime(MULTI_TOTAL_S);
    }, MULTI_MS);

    PHASES.forEach((_, i) => {
      schedule(() => {
        setSinglePhase(i);
        const next = Math.round(((i + 1) / PHASES.length) * 100);
        setSingleCtx(next);
        setSingleTime(((i + 1) * SINGLE_MS) / 1000);
      }, i * SINGLE_MS);
    });

    schedule(() => {
      setRunning(false);
      setSinglePhase(PHASES.length - 1);
      setSingleCtx(100);
      setSingleTime(SINGLE_TOTAL_S);
    }, PHASES.length * SINGLE_MS);
  }, [clearTimers]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sendQuery}
          disabled={running}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-white disabled:opacity-50"
        >
          Send Query
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#0d0e14] border border-border text-white"
        >
          Reset
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-text-secondary">Single agent</div>
          <div className="flex gap-1">
            {PHASES.map((p, i) => (
              <span
                key={p}
                className={`flex-1 text-center text-[10px] py-1 rounded border ${
                  singlePhase === i ? "border-accent text-accent" : "border-border text-text-secondary"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="text-[10px] text-text-secondary">Context</div>
          <div className="h-3 rounded bg-black/40 border border-border overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${heatPct(singleCtx)}`}
              style={{ width: `${singleCtx}%` }}
            />
          </div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-text-secondary">Specialists (parallel)</div>
          {(["Researcher", "Coder", "Reviewer"] as const).map((label, i) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-text-secondary">
                <span>{label}</span>
                <span className="text-accent">{multiCtx[i]}%</span>
              </div>
              <div className="h-2 rounded bg-black/40 border border-border overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${heatPct(multiCtx[i])}`}
                  style={{ width: `${multiCtx[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2 flex flex-wrap gap-4 text-xs">
        <span className="text-text-secondary">
          Single wall time: <span className="text-accent font-mono">{singleTime.toFixed(2)}s</span>
        </span>
        <span className="text-text-secondary">
          Multi wall time: <span className="text-accent font-mono">{multiTime.toFixed(2)}s</span>
        </span>
      </div>
    </div>
  );
}
