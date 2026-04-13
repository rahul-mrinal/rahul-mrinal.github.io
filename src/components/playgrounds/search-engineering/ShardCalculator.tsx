import { useState, useMemo } from "react";
import "../ChartTheme";

export default function ShardCalculator() {
  const [docs, setDocs] = useState(100);
  const [sizeKB, setSizeKB] = useState(5);
  const [maxShard, setMaxShard] = useState(30);
  const [replicas, setReplicas] = useState(1);

  const calc = useMemo(() => {
    const totalGB = (docs * 1e6 * sizeKB * 1024) / 1024 ** 3;
    const shards = Math.ceil(totalGB / maxShard);
    const totalCopies = shards * (replicas + 1);
    const clusterGB = totalGB * (replicas + 1);
    return { totalGB, shards, totalCopies, clusterGB };
  }, [docs, sizeKB, maxShard, replicas]);

  const fmt = (gb: number) => (gb >= 1024 ? (gb / 1024).toFixed(1) + " TB" : gb.toFixed(1) + " GB");
  const maxBar = Math.max(calc.clusterGB, 1);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Documents: <span className="text-accent font-mono">{docs >= 1000 ? (docs / 1000).toFixed(1) + "B" : docs + "M"}</span>
          </label>
          <input type="range" min={1} max={2000} value={docs} onChange={(e) => setDocs(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Avg Doc: <span className="text-accent font-mono">{sizeKB} KB</span>
          </label>
          <input type="range" min={1} max={20} value={sizeKB} onChange={(e) => setSizeKB(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Max Shard: <span className="text-accent font-mono">{maxShard} GB</span>
          </label>
          <input type="range" min={10} max={50} step={10} value={maxShard} onChange={(e) => setMaxShard(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Replicas: <span className="text-accent font-mono">{replicas}</span>
          </label>
          <input type="range" min={0} max={3} value={replicas} onChange={(e) => setReplicas(+e.target.value)} className="w-full accent-[#6c63ff]" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { l: "Raw Data", v: fmt(calc.totalGB), c: "#6c63ff" },
          { l: "Shards", v: String(calc.shards), c: "#00c9a7" },
          { l: "Total Copies", v: String(calc.totalCopies), c: "#ffd93d" },
          { l: "Cluster", v: fmt(calc.clusterGB), c: "#ff6b6b" },
        ].map((m) => (
          <div key={m.l} className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
            <div className="text-[10px] uppercase text-text-secondary tracking-wider">{m.l}</div>
            <div className="text-lg font-bold font-mono" style={{ color: m.c }}>{m.v}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {[
          { label: "Raw", gb: calc.totalGB, color: "#6c63ff" },
          { label: "Indexed (1.5×)", gb: calc.totalGB * 1.5, color: "#00c9a7" },
          { label: "Replicated", gb: calc.clusterGB, color: "#ffd93d" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-24 text-right">{b.label}</span>
            <div className="flex-1 h-5 bg-[#0d0e14] border border-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((b.gb / maxBar) * 100, 100)}%`, background: b.color }} />
            </div>
            <span className="text-xs font-mono text-text-secondary w-16">{fmt(b.gb)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
