import { useState, useRef, useCallback, useEffect } from "react";

const INTENTS = ["FAQ", "Technical", "Escalation"] as const;
type Intent = (typeof INTENTS)[number];

const PATH: Record<Intent, { node: string; intent: Intent; response: string }[]> = {
  FAQ: [
    { node: "classify", intent: "FAQ", response: "" },
    { node: "faq", intent: "FAQ", response: "Routing KB article." },
    { node: "end", intent: "FAQ", response: "Returned canned FAQ answer." },
  ],
  Technical: [
    { node: "classify", intent: "Technical", response: "" },
    { node: "technical", intent: "Technical", response: "Spawned code-aware sub-agent." },
    { node: "end", intent: "Technical", response: "Emitted patch + test steps." },
  ],
  Escalation: [
    { node: "classify", intent: "Escalation", response: "" },
    { node: "escalation", intent: "Escalation", response: "Opened human ticket P1." },
    { node: "end", intent: "Escalation", response: "Handoff transcript attached." },
  ],
};

export default function StateMachineViz() {
  const [intent, setIntent] = useState<Intent>("FAQ");
  const [active, setActive] = useState<string | null>(null);
  const [edge, setEdge] = useState<[string, string] | null>(null);
  const [idx, setIdx] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => clear(), [clear]);

  const st = idx >= 0 ? PATH[intent][idx] : { node: "idle", intent, response: "", completed: false };
  const json = JSON.stringify({ current_node: st.node, intent: st.intent, response: st.response, completed: idx === 2 }, null, 0);

  const trace = () => {
    clear();
    setIdx(-1);
    setActive(null);
    setEdge(null);
    setLog([]);
    const sched = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };
    let step = 0;
    const run = () => {
      if (step === 0) {
        setIdx(0);
        setActive("classify");
        setLog((l) => [...l, "enter classify"]);
        step++;
        sched(run, 500);
        return;
      }
      if (step === 1) {
        setEdge(["classify", intent.toLowerCase()]);
        setLog((l) => [...l, `edge classify→${intent}`]);
        step++;
        sched(run, 450);
        return;
      }
      if (step === 2) {
        setIdx(1);
        setActive(intent.toLowerCase());
        setLog((l) => [...l, `enter ${intent.toLowerCase()}`]);
        step++;
        sched(run, 500);
        return;
      }
      if (step === 3) {
        setEdge([intent.toLowerCase(), "end"]);
        setLog((l) => [...l, `edge ${intent.toLowerCase()}→end`]);
        step++;
        sched(run, 450);
        return;
      }
      setIdx(2);
      setActive("end");
      setLog((l) => [...l, "terminal end"]);
    };
    sched(run, 150);
  };

  const node = (id: string, label: string) => (
    <div className={`rounded-lg border px-2 py-1.5 text-center text-[10px] font-semibold transition ${active === id ? "border-accent text-accent bg-accent/10 shadow-[0_0_12px_rgba(108,99,255,0.35)]" : "border-border text-text-secondary bg-[#0d0e14]"}`}>{label}</div>
  );
  const eon = (a: string, b: string) => edge && edge[0] === a && edge[1] === b;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-[10px] text-text-secondary block mb-1">Intent</label>
          <select value={intent} onChange={(e) => setIntent(e.target.value as Intent)} className="bg-[#0d0e14] border border-border rounded-lg px-2 py-1 text-xs text-white accent-[#6c63ff]">
            {INTENTS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={trace} className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent text-white">
          Trace Path
        </button>
      </div>
      <div className="flex flex-col items-center gap-1 max-w-xs mx-auto">
        {node("classify", "Classify")}
        <div className={`w-px h-3 ${eon("classify", intent.toLowerCase()) ? "bg-accent" : "bg-border"}`} />
        <div className="grid grid-cols-3 gap-1 w-full">
          {node("faq", "FAQ")}
          {node("technical", "Technical")}
          {node("escalation", "Escalation")}
        </div>
        <div className={`w-px h-3 ${eon(intent.toLowerCase(), "end") ? "bg-accent" : "bg-border"}`} />
        {node("end", "END")}
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <pre className="bg-[#0d0e14] border border-border rounded-lg p-2 text-[9px] text-accent overflow-x-auto font-mono whitespace-pre-wrap">{json}</pre>
        <div className="bg-[#0d0e14] border border-border rounded-lg p-2 text-[9px] text-text-secondary font-mono max-h-28 overflow-y-auto">{log.length ? log.map((x, i) => `${i + 1}. ${x}`).join("\n") : "-"}</div>
      </div>
    </div>
  );
}
