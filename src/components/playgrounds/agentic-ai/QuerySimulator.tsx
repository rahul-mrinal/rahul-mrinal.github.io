import { useCallback, useEffect, useRef, useState } from "react";

type Spec = { q: string; intent: string; box: "FAQ" | "Tech" | "Billing" | "Escalation"; resp: string; tok: number; ms: number };

const DATA: Spec[] = [
  { q: "What are your hours?", intent: "hours_info", box: "FAQ", resp: "We are open 9–5 ET weekdays.", tok: 210, ms: 420 },
  { q: "My API returns 500", intent: "api_error", box: "Tech", resp: "Check logs for stack trace; verify auth and rate limits.", tok: 380, ms: 890 },
  { q: "Wrong invoice amount", intent: "billing_dispute", box: "Billing", resp: "Opened ticket #4821; finance will reconcile within 2 days.", tok: 290, ms: 650 },
  { q: "I want to cancel", intent: "retention_risk", box: "Escalation", resp: "Routing to retention specialist with your account context.", tok: 340, ms: 720 },
];

const BOXES = ["Classify", "FAQ", "Tech", "Billing", "Escalation"] as const;

export default function QuerySimulator() {
  const [sel, setSel] = useState(0);
  const [run, setRun] = useState(false);
  const [phase, setPhase] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState<Spec | null>(null);
  const t = useRef<number[]>([]);
  const stamp = () => {
    const d = new Date();
    return `${d.toLocaleTimeString([], { hour12: false })}.${String(d.getMilliseconds()).padStart(3, "0")}`;
  };
  const active = (b: (typeof BOXES)[number]) => {
    if (!run && !done) return false;
    if (done) return false;
    if (b === "Classify") return phase >= 1 && phase <= 2;
    const spec = DATA[sel];
    if (phase < 3) return false;
    if (b === "FAQ") return spec.box === "FAQ";
    if (b === "Tech") return spec.box === "Tech";
    if (b === "Billing") return spec.box === "Billing";
    return spec.box === "Escalation";
  };
  const go = useCallback(() => {
    t.current.forEach(clearTimeout);
    t.current = [];
    setDone(null);
    setRun(true);
    setPhase(0);
    setLogs([`${stamp()} Query queued: "${DATA[sel].q}"`]);
    const spec = DATA[sel];
    const push = (msg: string, after: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        setLogs((l) => [...l, `${stamp()} ${msg}`]);
        fn();
      }, after);
      t.current.push(id);
    };
    push(`Classify: intent=${spec.intent}`, 500, () => setPhase(1));
    push("Route: specialist selected", 1100, () => setPhase(3));
    push(`Response drafted (${spec.tok} tokens)`, 1700, () => {
      setPhase(4);
      setRun(false);
      setDone(spec);
    });
  }, [sel]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  return (
    <div className="space-y-3">
      <select value={sel} onChange={(e) => setSel(+e.target.value)} className="w-full bg-[#0d0e14] border border-border rounded px-2 py-2 text-sm text-white accent-[#6c63ff]">
        {DATA.map((d, i) => (
          <option key={d.q} value={i}>
            {d.q}
          </option>
        ))}
      </select>
      <button type="button" onClick={go} disabled={run} className="w-full py-2 text-xs font-semibold rounded border border-accent text-accent disabled:opacity-40">
        Run
      </button>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {BOXES.map((b) => (
          <div key={b} className={`text-[10px] px-2 py-1 rounded border font-mono ${active(b) ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary bg-[#0d0e14]"}`}>
            {b}
          </div>
        ))}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-2 max-h-28 overflow-y-auto font-mono text-[10px] text-text-secondary space-y-0.5">
        {logs.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {done && (
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 space-y-1 text-xs">
          <p className="text-white">{done.resp}</p>
          <p className="text-text-secondary">
            Latency {done.ms} ms · Tokens {done.tok} · Path Query → Classify → {done.box}
          </p>
        </div>
      )}
    </div>
  );
}
