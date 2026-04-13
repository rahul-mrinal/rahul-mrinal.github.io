import { useMemo, useState } from "react";

type P = "Very" | "Somewhat" | "Unpredictable";
type Q = "Speed" | "Balanced" | "Quality";
type A = "Strictly" | "Mostly" | "Not critical";

function pick(pred: P, pri: Q, aud: A): { name: string; why: string } {
  if (pred === "Very" && pri === "Speed" && aud === "Strictly") return { name: "Graph", why: "Structured flow with explicit audit edges." };
  if (pred === "Very" && pri === "Speed" && aud === "Not critical") return { name: "Sequential", why: "Linear pipeline minimizes routing overhead." };
  if (pred === "Very" && pri === "Balanced") return { name: "Hierarchical", why: "Supervisor decomposes stable workflows." };
  if (pred === "Very" && pri === "Quality") return { name: "Graph", why: "Gate quality checks as first-class nodes." };
  if (pred === "Somewhat" && pri === "Balanced") return { name: "Selector", why: "Dynamic routing without heavy orchestration." };
  if (pred === "Somewhat" && pri === "Speed") return { name: "Handoff", why: "Fast specialist swaps on partial paths." };
  if (pred === "Somewhat" && pri === "Quality") return { name: "Hierarchical", why: "Layered review improves output fidelity." };
  if (pred === "Somewhat") return { name: "Selector", why: "Balanced control vs flexibility." };
  if (pred === "Unpredictable" && pri === "Quality") return aud === "Not critical" ? { name: "Ensemble", why: "Parallel diverse models reduce blind spots." } : { name: "Debate", why: "Adversarial passes improve rigor and traceability." };
  if (pred === "Unpredictable" && pri === "Balanced") return { name: "Blackboard", why: "Shared surface fits emergent subtasks." };
  if (pred === "Unpredictable" && pri === "Speed") return { name: "Market", why: "Competition can surface a fast viable answer." };
  return { name: "Selector", why: "Safe default when signals conflict." };
}

function RadioRow<T extends string>({ name, opts, val, set }: { name: string; opts: readonly T[]; val: T; set: (v: T) => void }) {
  return (
    <div className="space-y-2">
      {opts.map((o) => (
        <label key={o} className="flex items-center gap-2 text-[11px] text-text-secondary">
          <input type="radio" name={name} checked={val === o} onChange={() => set(o)} className="accent-[#6c63ff]" />
          {o}
        </label>
      ))}
    </div>
  );
}

export default function PatternWizard() {
  const [step, setStep] = useState(0);
  const [pred, setPred] = useState<P>("Somewhat");
  const [pri, setPri] = useState<Q>("Balanced");
  const [aud, setAud] = useState<A>("Mostly");
  const rec = useMemo(() => pick(pred, pri, aud), [pred, pri, aud]);
  const pct = step >= 3 ? 100 : ((step + 1) / 3) * 100;
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-3 space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>{step >= 3 ? "3 of 3" : `${step + 1} of 3`}</span>
          <span className="text-accent">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 rounded bg-black/40 border border-border overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {step === 0 && (
        <>
          <p className="text-[10px] font-medium text-accent">How predictable is the workflow?</p>
          <RadioRow name="pred" opts={["Very", "Somewhat", "Unpredictable"] as const} val={pred} set={setPred} />
        </>
      )}
      {step === 1 && (
        <>
          <p className="text-[10px] font-medium text-accent">Quality vs Speed priority?</p>
          <RadioRow name="pri" opts={["Speed", "Balanced", "Quality"] as const} val={pri} set={setPri} />
        </>
      )}
      {step === 2 && (
        <>
          <p className="text-[10px] font-medium text-accent">Need auditability?</p>
          <RadioRow name="aud" opts={["Strictly", "Mostly", "Not critical"] as const} val={aud} set={setAud} />
        </>
      )}
      {step >= 3 && (
        <div className="rounded border border-accent/40 bg-black/25 p-3 space-y-1">
          <div className="text-sm font-semibold text-accent">{rec.name}</div>
          <p className="text-[11px] text-text-secondary">{rec.why}</p>
        </div>
      )}
      {step < 3 ? (
        <div className="flex gap-2">
          <button type="button" disabled={step === 0} className="px-3 py-1 text-[10px] rounded border border-border disabled:opacity-40" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </button>
          <button type="button" className="px-3 py-1 text-[10px] rounded border border-accent text-accent" onClick={() => setStep((s) => (s === 2 ? 3 : s + 1))}>
            {step === 2 ? "Finish" : "Next"}
          </button>
        </div>
      ) : (
        <button type="button" className="px-3 py-1 text-[10px] rounded border border-border" onClick={() => setStep(2)}>
          Back
        </button>
      )}
    </div>
  );
}
