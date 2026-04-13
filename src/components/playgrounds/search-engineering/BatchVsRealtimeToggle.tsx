import { useState } from "react";
import "../ChartTheme";

const ROWS: { label: string; batch: string; realtime: string }[] = [
  { label: "Latency", batch: "Minutes–hours", realtime: "Seconds" },
  { label: "Complexity", batch: "Low", realtime: "High" },
  { label: "Consistency", batch: "Strong (snapshot)", realtime: "Eventual" },
  { label: "Error Recovery", batch: "Re-run job", realtime: "DLQ + retries" },
  { label: "Infra Cost", batch: "Pay per run", realtime: "Always-on" },
  { label: "Drift Risk", batch: "None (full rebuild)", realtime: "Can accumulate" },
];

const STEPS_BATCH = ["Scheduler", "Query DB", "Transform", "Build Index", "Alias Swap"];
const STEPS_RT = ["CDC Event", "Kafka", "Stream Worker", "Upsert Doc", "Searchable"];

export default function BatchVsRealtimeToggle() {
  const [mode, setMode] = useState<"batch" | "realtime">("batch");
  const [step, setStep] = useState(0);
  const steps = mode === "batch" ? STEPS_BATCH : STEPS_RT;
  const isBatch = mode === "batch";

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["batch", "realtime"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setStep(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === m ? "bg-accent text-white" : "bg-[#0d0e14] border border-border text-text-secondary hover:border-accent"}`}
          >
            {m === "batch" ? "Batch" : "Real-Time"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 mb-4 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <button
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${i === step ? (isBatch ? "bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]" : "bg-[#00c9a7]/20 text-[#00c9a7] border border-[#00c9a7]") : "bg-[#0d0e14] border border-border text-text-secondary"}`}
            >
              {s}
            </button>
            {i < steps.length - 1 && <span className="text-text-secondary text-xs">→</span>}
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-[#0d0e14] border border-border rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((step + 1) / steps.length) * 100}%`,
            background: isBatch ? "#6c63ff" : "#00c9a7",
          }}
        />
      </div>

      <div className="space-y-1">
        {ROWS.map((r) => (
          <div key={r.label} className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-2">
            <span className="text-xs text-text-secondary w-28 shrink-0">{r.label}</span>
            <span className={`flex-1 text-sm font-mono ${isBatch ? "text-[#6c63ff]" : "text-[#00c9a7]"}`}>
              {isBatch ? r.batch : r.realtime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
