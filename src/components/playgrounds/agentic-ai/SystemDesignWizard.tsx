import { useMemo, useState } from "react";

const ARCH = ["Graph", "Selector", "Hierarchical", "Sequential"] as const;
const ROLES = ["Classifier", "FAQ", "Technical", "Billing", "Escalation", "Quality"] as const;
const ROLE_BY_ARCH: Record<(typeof ARCH)[number], (typeof ROLES)[number][]> = {
  Graph: [...ROLES],
  Selector: ["Classifier", "FAQ", "Technical", "Billing"],
  Hierarchical: ["Classifier", "FAQ", "Technical", "Escalation"],
  Sequential: ["Classifier", "FAQ", "Technical", "Billing", "Quality"],
};
const COMM = ["Direct Messaging", "Shared State", "Pub/Sub"] as const;

export default function SystemDesignWizard() {
  const [step, setStep] = useState(0);
  const [arch, setArch] = useState<(typeof ARCH)[number] | null>(null);
  const [agents, setAgents] = useState<Record<string, boolean>>({});
  const [comm, setComm] = useState<(typeof COMM)[number] | null>(null);
  const roles = arch ? ROLE_BY_ARCH[arch] : [];
  const toggle = (r: string) => setAgents((a) => ({ ...a, [r]: !a[r] }));
  const count = useMemo(() => roles.filter((r) => agents[r]).length, [agents, roles]);
  const score = useMemo(() => {
    let s = 0;
    if (arch) s += arch === "Graph" ? 18 : arch === "Selector" ? 22 : arch === "Hierarchical" ? 20 : 16;
    s += Math.min(30, count * 6);
    if (comm === "Direct Messaging") s += 22;
    else if (comm === "Pub/Sub") s += 26;
    else if (comm === "Shared State") s += 14;
    return Math.min(100, s);
  }, [arch, comm, count]);
  const cx = arch === "Graph" ? "High" : arch === "Sequential" ? "Medium" : "Moderate";
  const g =
    comm === "Shared State"
      ? "Add versioning, TTLs, and conflict rules on shared state."
      : comm === "Pub/Sub"
        ? "Define topics, idempotency, and dead-letter handling."
        : "Document synchronous contracts and backpressure between agents.";
  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step === i ? "border-accent text-accent bg-[#0d0e14]" : "border-border text-text-secondary"}`}>{i + 1}</div>
            <span className="text-[9px] text-text-secondary text-center leading-tight">{["Arch", "Agents", "Comm", "Review"][i]}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-3 min-h-[140px]">
        {step === 0 && (
          <>
            <p className="text-xs font-semibold text-accent mb-2">Choose Architecture</p>
            <div className="grid grid-cols-2 gap-2">
            {ARCH.map((a) => (
              <button key={a} type="button" onClick={() => { setArch(a); setAgents({}); }} className={`py-2 text-xs font-semibold rounded border ${arch === a ? "border-accent text-accent" : "border-border text-white hover:border-accent/50"}`}>
                {a}
              </button>
            ))}
            </div>
          </>
        )}
        {step === 1 && arch && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-accent mb-2">Define Agents</p>
            {roles.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input type="checkbox" checked={!!agents[r]} onChange={() => toggle(r)} className="accent-[#6c63ff]" />
                {r}
              </label>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-accent mb-2">Communication Pattern</p>
            {COMM.map((c) => (
              <button key={c} type="button" onClick={() => setComm(c)} className={`w-full py-2 text-xs rounded border text-left px-3 ${comm === c ? "border-accent text-accent" : "border-border text-text-secondary hover:border-accent/40"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="text-xs space-y-2 text-text-secondary">
            <p className="text-xs font-semibold text-accent">Review</p>
            <p>
              <span className="text-accent">Architecture:</span> {arch ?? "-"}
            </p>
            <p>
              <span className="text-accent">Agents:</span> {roles.filter((r) => agents[r]).join(", ") || "-"}
            </p>
            <p>
              <span className="text-accent">Communication:</span> {comm ?? "-"}
            </p>
            <p className="text-white font-mono">System score: {score}/100</p>
            <p>
              <span className="text-accent">Complexity:</span> {cx}
            </p>
            <p className="border border-border rounded p-2">{g}</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="flex-1 py-2 text-xs rounded border border-border text-white disabled:opacity-40">
          Back
        </button>
        <button
          type="button"
          disabled={(step === 0 && !arch) || (step === 1 && count === 0) || (step === 2 && !comm) || step === 3}
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          className="flex-1 py-2 text-xs rounded border border-accent text-accent disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
