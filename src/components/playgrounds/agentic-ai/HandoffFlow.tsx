import { useState, useCallback, useRef, useEffect } from "react";

const MESSAGES = [
  { id: "m1", text: "I was double-charged on my last statement.", target: "Billing" as const },
  { id: "m2", text: "The dashboard spinner never finishes loading.", target: "Technical" as const },
  { id: "m3", text: "Please reverse the $79 fee from March 2.", target: "Billing" as const },
  { id: "m4", text: "OAuth callback returns 502 from your API.", target: "Technical" as const },
];

type Phase = "idle" | "triage" | "line" | "target" | "done";

function ts() {
  return new Date().toLocaleTimeString(undefined, { hour12: false });
}

const RESPONSES = {
  Billing: "Billing agent: charge located - refund initiated.",
  Technical: "Technical agent: repro confirmed - patch ticket opened.",
} as const;

export default function HandoffFlow() {
  const [msgId, setMsgId] = useState(MESSAGES[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const clearT = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearT(), [clearT]);

  const push = useCallback((line: string) => {
    setLog((prev) => [`[${ts()}] ${line}`, ...prev].slice(0, 14));
  }, []);

  const start = useCallback(() => {
    clearT();
    setLog([]);
    const msg = MESSAGES.find((m) => m.id === msgId)!;
    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    setPhase("triage");
    push("Triage received message");
    schedule(600, () => {
      push("Triage analyzing intent / urgency");
    });
    schedule(1400, () => {
      setPhase("line");
      push(`Routing handoff → ${msg.target}`);
    });
    schedule(2400, () => {
      setPhase("target");
      push(`${msg.target} agent active`);
    });
    schedule(3600, () => {
      setPhase("done");
      push(RESPONSES[msg.target]);
    });
  }, [msgId, clearT, push]);

  const busy = phase !== "idle" && phase !== "done";
  const msg = MESSAGES.find((m) => m.id === msgId)!;

  const circle = (label: "Triage" | "Billing" | "Technical") => {
    let ring = "border-border";
    if (label === "Triage" && phase === "triage") ring = "border-accent";
    if (label === msg.target && phase === "target") ring = "border-[#00c9a7]";
    if (label === msg.target && phase === "done") ring = "border-[#00c9a7]";
    return (
      <div
        className={`w-20 h-20 rounded-full bg-[#0d0e14] border-2 ${ring} flex items-center justify-center text-xs font-semibold text-text-secondary transition-colors duration-500`}
      >
        {label}
      </div>
    );
  };

  const lineBright =
    (phase === "line" || phase === "target" || phase === "done") && msg.target === "Billing";

  const lineBrightR =
    (phase === "line" || phase === "target" || phase === "done") && msg.target === "Technical";

  return (
    <div>
      <label className="text-xs font-semibold text-text-secondary block mb-1">Message</label>
      <select
        value={msgId}
        onChange={(e) => {
          setMsgId(e.target.value);
          setPhase("idle");
          setLog([]);
        }}
        disabled={busy}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent accent-[#6c63ff] mb-3 disabled:opacity-50"
      >
        {MESSAGES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.text}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-4"
      >
        Start Handoff
      </button>
      <div className="relative h-52 mb-3">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          <line
            x1="50%"
            y1="18%"
            x2="22%"
            y2="78%"
            stroke={lineBright ? "#6c63ff" : "#2a2d3a"}
            strokeWidth="2"
            className="transition-colors duration-500"
          />
          <line
            x1="50%"
            y1="18%"
            x2="78%"
            y2="78%"
            stroke={lineBrightR ? "#6c63ff" : "#2a2d3a"}
            strokeWidth="2"
            className="transition-colors duration-500"
          />
        </svg>
        <div className="absolute left-1/2 top-0 -translate-x-1/2">{circle("Triage")}</div>
        <div className="absolute left-[10%] bottom-0">{circle("Billing")}</div>
        <div className="absolute right-[10%] bottom-0">{circle("Technical")}</div>
      </div>
      {phase === "target" || phase === "done" ? (
        <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-xs text-text-secondary mb-3">
          {RESPONSES[msg.target]}
        </div>
      ) : null}
      <div className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2 max-h-32 overflow-y-auto font-mono text-[10px] text-text-secondary space-y-1">
        {log.length === 0 ? <span className="opacity-50">-</span> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
