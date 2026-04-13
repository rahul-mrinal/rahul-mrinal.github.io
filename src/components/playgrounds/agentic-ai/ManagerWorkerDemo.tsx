import { useState, useCallback, useRef, useEffect } from "react";

const WORKERS = ["Researcher", "Writer", "Designer"] as const;

export default function ManagerWorkerDemo() {
  const [task, setTask] = useState("Launch a landing page for our Q2 analytics product.");
  const [decomposed, setDecomposed] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [synthesized, setSynthesized] = useState(false);
  const [progress, setProgress] = useState([0, 0, 0]);
  const [manager, setManager] = useState("Idle - awaiting task breakdown.");
  const execTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (execTimer.current !== null) clearInterval(execTimer.current);
    };
  }, []);

  const subtasks = decomposed
    ? [
        "Gather competitor pages + SEO keywords.",
        "Draft hero, proof points, and CTA copy.",
        "Produce layout grid + component styles.",
      ]
    : ["", "", ""];

  const decompose = useCallback(() => {
    setDecomposed(true);
    setExecuted(false);
    setSynthesized(false);
    setProgress([0, 0, 0]);
    setManager("Decomposed work into 3 parallel-ready subtasks.");
  }, []);

  const execute = useCallback(() => {
    if (!decomposed) return;
    if (execTimer.current !== null) clearInterval(execTimer.current);
    setExecuted(true);
    setSynthesized(false);
    setProgress([0, 0, 0]);
    setManager("Workers executing subtasks…");
    const steps = 20;
    let n = 0;
    execTimer.current = window.setInterval(() => {
      n += 1;
      const p = Math.min(100, (n / steps) * 100);
      setProgress([p, p * 0.85, p * 0.92]);
      if (n >= steps) {
        if (execTimer.current !== null) clearInterval(execTimer.current);
        execTimer.current = null;
        setProgress([100, 100, 100]);
        setManager("All workers reported completion.");
      }
    }, 80);
  }, [decomposed]);

  const synthesize = useCallback(() => {
    if (!executed) return;
    setSynthesized(true);
    setManager("Synthesis merged outputs into final deliverable.");
  }, [executed]);

  const canSynth = executed && progress.every((p) => p >= 100);

  return (
    <div>
      <label className="text-xs font-semibold text-text-secondary block mb-1">Task</label>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent mb-3"
      />
      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" onClick={decompose} className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Decompose
        </button>
        <button
          type="button"
          onClick={execute}
          disabled={!decomposed}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Execute
        </button>
        <button
          type="button"
          onClick={synthesize}
          disabled={!canSynth}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Synthesize
        </button>
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg px-4 py-3 mb-3">
        <div className="text-xs font-semibold text-text-secondary mb-1">Manager</div>
        <div className="text-sm text-accent">{manager}</div>
      </div>
      <div className="grid gap-2 mb-3">
        {WORKERS.map((w, i) => (
          <div key={w} className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
            <div className="text-xs font-semibold text-text-secondary mb-1">{w}</div>
            <div className="text-[11px] text-text-secondary mb-2 min-h-[2rem]">
              {subtasks[i] || "-"}
            </div>
            <div className="h-1.5 rounded-full bg-[#1a1c25] overflow-hidden">
              <div
                className="h-full bg-accent transition-[width] duration-100 ease-linear rounded-full"
                style={{ width: `${progress[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {synthesized && (
        <div className="bg-[#0d0e14] border border-border rounded-lg px-4 py-3">
          <div className="text-xs font-semibold text-text-secondary mb-1">Synthesis</div>
          <div className="text-sm text-text-secondary leading-snug">
            Packaged brief, copy deck, and visual spec for handoff to engineering. Task:{" "}
            <span className="text-white">
              {task.slice(0, 80)}
              {task.length > 80 ? "…" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
