import { useMemo, useState } from "react";

const MIN = 4096;
const MAX = 128000;
const TOK_MSG = 200;
const LOAD = 52000;

function heat(u: number) {
  if (u < 45) return "text-emerald-400";
  if (u < 75) return "text-yellow-400";
  return "text-red-400";
}

function Bar({ pct }: { pct: number }) {
  const p = Math.min(100, Math.max(0, pct));
  const bg = p < 45 ? "bg-emerald-500" : p < 75 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="h-2 rounded bg-black/40 border border-border overflow-hidden">
      <div className={`h-full transition-all ${bg}`} style={{ width: `${p}%` }} />
    </div>
  );
}

export default function ContextStrategy() {
  const [w, setW] = useState(32000);
  const fit = Math.floor(w / TOK_MSG);
  const util = Math.min(100, (LOAD / w) * 100);
  const fullMsgs = Math.min(fit, Math.ceil(LOAD / TOK_MSG));
  const slideN = Math.min(15, fit);
  const sumTok = Math.floor(w * 0.22);
  const recTok = w - sumTok;
  const recPct = (recTok / w) * 100;
  const m = useMemo(() => {
    const qFull = Math.round(Math.max(0, 100 - util * 0.9));
    const qSlide = Math.round(72 + Math.min(20, w / 8000));
    const qSum = Math.round(88 + Math.min(10, w / 16000));
    return {
      full: { msgs: fullMsgs, q: qFull, tok: Math.min(LOAD, w) },
      slide: { msgs: slideN, q: qSlide, tok: slideN * TOK_MSG },
      sum: { msgs: Math.floor(recTok / TOK_MSG) + 1, q: qSum, tok: Math.floor(w * 0.78) },
    };
  }, [w, fullMsgs, slideN, recTok, util]);
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-3 space-y-3">
      <label className="flex items-center gap-2 text-[10px] text-text-secondary">
        <span className="whitespace-nowrap">
          Window: <span className="text-accent font-mono">{w >= 1000 ? `${(w / 1000).toFixed(1)}K` : w}</span> tok
        </span>
        <input type="range" min={MIN} max={MAX} step={1024} value={w} onChange={(e) => setW(+e.target.value)} className="flex-1 accent-[#6c63ff]" />
      </label>
      <div className="grid md:grid-cols-3 gap-2">
        {[
          { k: "full", title: "Full Buffer", u: util, ...m.full },
          { k: "slide", title: "Sliding Window", u: (slideN * TOK_MSG / w) * 100, ...m.slide },
          { k: "sum", title: "Summary + Recent", u: recPct, ...m.sum },
        ].map((p) => (
          <div key={p.k} className="rounded border border-border p-2 space-y-1.5 bg-black/20">
            <div className="text-[10px] font-semibold text-accent">{p.title}</div>
            {p.k === "sum" && (
              <div className="space-y-0.5">
                <div className="text-[9px] text-text-secondary">Summary</div>
                <Bar pct={(sumTok / w) * 100} />
                <div className="text-[9px] text-text-secondary">Recent</div>
              </div>
            )}
            <Bar pct={p.u} />
            <div className={`text-[11px] font-mono ${p.k === "full" ? heat(util) : heat(p.u)}`}>Msgs: {p.msgs}</div>
            <div className="text-[10px] text-text-secondary">Quality ~{p.q}%</div>
            <div className="text-[10px] text-text-secondary">Tokens ~{p.tok.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
