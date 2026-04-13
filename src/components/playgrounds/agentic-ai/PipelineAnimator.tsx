import { useState, useCallback, useRef, useEffect } from "react";

type AgentState = "idle" | "active" | "done";

const AGENTS = ["Research", "Writer", "Editor"] as const;
const STEP_MS = 1500;

function ts() {
  return new Date().toLocaleTimeString(undefined, { hour12: false });
}

export default function PipelineAnimator() {
  const [agentState, setAgentState] = useState<AgentState[]>(() => ["idle", "idle", "idle"]);
  const [dotPct, setDotPct] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const timersRef = useRef<{ t: number[]; i?: number }>({ t: [] });

  const clearTimers = useCallback(() => {
    const { t, i } = timersRef.current;
    t.forEach((id) => clearTimeout(id));
    if (i !== undefined) clearInterval(i);
    timersRef.current = { t: [] };
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const pushLog = useCallback((msg: string) => {
    setLog((prev) => [`[${ts()}] ${msg}`, ...prev].slice(0, 12));
  }, []);

  const sendQuery = useCallback(() => {
    if (running) return;
    clearTimers();
    setRunning(true);
    setLog([]);
    setLatencyMs(0);
    setAgentState(["idle", "idle", "idle"]);
    setDotPct(0);

    const lat = window.setInterval(() => setLatencyMs((m) => m + 100), 100);
    timersRef.current.i = lat;

    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.t.push(id);
    };

    const dotAt = (idx: number) => setDotPct(idx / (AGENTS.length - 1));

    AGENTS.forEach((name, i) => {
      after(i * STEP_MS, () => {
        setAgentState((s) =>
          s.map((_, j) => (j === i ? "active" : j < i ? "done" : "idle"))
        );
        dotAt(i);
        pushLog(`${name} started`);
      });
      after(i * STEP_MS + STEP_MS, () => {
        setAgentState((s) => s.map((_, j) => (j <= i ? "done" : s[j])));
        pushLog(`${name} completed`);
        if (i < AGENTS.length - 1) dotAt(i + 1);
      });
    });

    after(AGENTS.length * STEP_MS + 100, () => {
      if (timersRef.current.i !== undefined) clearInterval(timersRef.current.i);
      timersRef.current.i = undefined;
      pushLog("Pipeline finished");
      setRunning(false);
    });
  }, [running, clearTimers, pushLog]);

  const boxClass = (i: number) => {
    const s = agentState[i];
    const border =
      s === "active" ? "border-accent" : s === "done" ? "border-[#00c9a7]" : "border-border";
    return `bg-[#0d0e14] border ${border} rounded-lg px-4 py-3 flex-1 text-center transition-colors duration-300`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-text-secondary">Latency</span>
        <span className="text-sm font-mono text-accent">{latencyMs} ms</span>
      </div>
      <div className="relative flex gap-2 mb-3">
        {AGENTS.map((name, i) => (
          <div key={name} className={boxClass(i)}>
            <div className="text-xs font-semibold text-text-secondary">{name}</div>
          </div>
        ))}
      </div>
      <div className="relative h-6 mb-4">
        <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-border -translate-y-1/2" />
        <div
          className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-accent -translate-y-1/2 -translate-x-1/2 shadow-[0_0_12px_#6c63ff] transition-[left] duration-700 ease-in-out"
          style={{ left: `${12 + dotPct * 76}%` }}
        />
      </div>
      <button
        type="button"
        onClick={sendQuery}
        disabled={running}
        className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-3"
      >
        Send Query
      </button>
      <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2 max-h-36 overflow-y-auto font-mono text-[10px] text-text-secondary space-y-1">
        {log.length === 0 ? <span className="opacity-50">-</span> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
