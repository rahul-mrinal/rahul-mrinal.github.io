import { useState, useMemo } from "react";
import "../ChartTheme";

const SAMPLE = `Retrieval-Augmented Generation (RAG) combines retrieval with language models. The retriever finds relevant documents from a knowledge base. These documents are then passed as context to the LLM.\n\nChunking is critical because embedding models have token limits. A 50-page document cannot fit in a single embedding. The chunk size determines the granularity of retrieval.\n\nSmall chunks offer precise retrieval but lose surrounding context. Large chunks preserve context but dilute relevance. Most practitioners find 200-500 tokens works best for general-purpose RAG.`;

type Strategy = "fixed" | "sentence" | "paragraph";

function chunkFixed(text: string, size: number, overlap: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += Math.max(1, size - overlap)) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}

function chunkSentence(text: string, size: number): string[] {
  const sents = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let buf: string[] = [];
  for (const s of sents) {
    buf.push(s);
    if (buf.join(" ").split(/\s+/).length >= size) {
      chunks.push(buf.join(" "));
      buf = [];
    }
  }
  if (buf.length) chunks.push(buf.join(" "));
  return chunks;
}

function chunkParagraph(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

const COLORS = ["#6c63ff", "#00c9a7", "#ffd93d", "#ff6b6b", "#54a0ff", "#ff9f43"];

export default function ChunkingPlayground() {
  const [text, setText] = useState(SAMPLE);
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const [size, setSize] = useState(30);
  const [overlap, setOverlap] = useState(5);

  const chunks = useMemo(() => {
    if (strategy === "fixed") return chunkFixed(text, size, overlap);
    if (strategy === "sentence") return chunkSentence(text, size);
    return chunkParagraph(text);
  }, [text, strategy, size, overlap]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono resize-y mb-3"
      />
      <div className="flex gap-2 mb-3 flex-wrap">
        {(["fixed", "sentence", "paragraph"] as const).map((s) => (
          <button key={s} onClick={() => setStrategy(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${strategy === s ? "bg-accent text-white" : "bg-[#0d0e14] border border-border text-text-secondary"}`}>
            {s}
          </button>
        ))}
      </div>
      {strategy !== "paragraph" && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-text-secondary">Size: <span className="text-accent font-mono">{size} words</span></label>
            <input type="range" min={10} max={80} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-[#6c63ff]" />
          </div>
          {strategy === "fixed" && (
            <div>
              <label className="text-xs font-medium text-text-secondary">Overlap: <span className="text-accent font-mono">{overlap}</span></label>
              <input type="range" min={0} max={Math.floor(size / 2)} value={overlap} onChange={(e) => setOverlap(+e.target.value)} className="w-full accent-[#6c63ff]" />
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-text-secondary">{chunks.length} chunks</span>
        <span className="text-xs text-text-secondary">·</span>
        <span className="text-xs text-text-secondary">avg {chunks.length ? Math.round(chunks.reduce((s, c) => s + c.split(/\s+/).length, 0) / chunks.length) : 0} words</span>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {chunks.map((c, i) => (
          <div key={i} className="flex items-start gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</span>
            <span className="text-xs text-text-secondary leading-relaxed">{c}</span>
            <span className="text-[10px] font-mono text-text-secondary shrink-0">{c.split(/\s+/).length}w</span>
          </div>
        ))}
      </div>
    </div>
  );
}
