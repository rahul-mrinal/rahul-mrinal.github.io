import { useState } from "react";
import "../ChartTheme";

const OFFLINE = [
  { label: "Raw Documents", detail: "PDFs, HTML, Markdown, DOCX" },
  { label: "Chunking", detail: "Split into 256-512 token passages" },
  { label: "Embedding", detail: "Sentence-transformer → 768-dim vectors" },
  { label: "Vector Store", detail: "HNSW index in Pinecone/Qdrant/Weaviate" },
];

const ONLINE = [
  { label: "User Query", detail: "Natural language question" },
  { label: "Embed Query", detail: "Same model as indexing (~10ms)" },
  { label: "Retrieve Top-K", detail: "ANN search → 50-100 candidates" },
  { label: "Re-Rank", detail: "Cross-encoder scores top 20 (~80ms)" },
  { label: "Build Prompt", detail: "System + context chunks + question" },
  { label: "LLM Generate", detail: "GPT-4 / Claude generates answer" },
];

const COLORS_OFF = ["#6c63ff", "#54a0ff", "#00c9a7", "#ffd93d"];
const COLORS_ON = ["#ff9f43", "#6c63ff", "#54a0ff", "#00c9a7", "#ffd93d", "#ff6b6b"];

export default function RagPipelineFlow() {
  const [phase, setPhase] = useState<"offline" | "online">("offline");
  const [step, setStep] = useState(0);
  const steps = phase === "offline" ? OFFLINE : ONLINE;
  const colors = phase === "offline" ? COLORS_OFF : COLORS_ON;

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["offline", "online"] as const).map((p) => (
          <button key={p} onClick={() => { setPhase(p); setStep(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${phase === p ? "bg-accent text-white" : "bg-[#0d0e14] border border-border text-text-secondary"}`}>
            {p === "offline" ? "Offline (Indexing)" : "Online (Query)"}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 transition-all text-left ${i === step ? "bg-[#0d0e14] border-2" : i < step ? "bg-[#0d0e14]/50 border border-border opacity-60" : "bg-[#0d0e14]/30 border border-border/50 opacity-40"}`}
            style={i === step ? { borderColor: colors[i % colors.length] } : undefined}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: i <= step ? colors[i % colors.length] : "#2a2d3a" }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{s.label}</div>
              {i === step && <div className="text-xs text-text-secondary mt-0.5">{s.detail}</div>}
            </div>
            {i < step && <span className="text-xs text-[#00c9a7] font-mono shrink-0">done</span>}
            {i === step && <span className="text-xs font-mono shrink-0" style={{ color: colors[i % colors.length] }}>active</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={prev} disabled={step === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d0e14] border border-border text-text-secondary disabled:opacity-30">
          ← Prev
        </button>
        <button onClick={next} disabled={step === steps.length - 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white disabled:opacity-30">
          Next →
        </button>
        <button onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d0e14] border border-border text-text-secondary ml-auto">
          Reset
        </button>
      </div>
    </div>
  );
}
