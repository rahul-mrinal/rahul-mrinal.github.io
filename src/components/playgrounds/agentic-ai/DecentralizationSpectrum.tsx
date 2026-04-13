import { useMemo, useState } from "react";

function E({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <div
      className="pointer-events-none absolute border-t border-border"
      style={{ left: x1, top: y1, width: len, transform: `rotate(${ang}deg)`, transformOrigin: "0 0" }}
    />
  );
}

function N({ x, y, l }: { x: number; y: number; l: string }) {
  return (
    <div
      className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-[#12131a] text-[8px] font-mono text-accent"
      style={{ left: x, top: y }}
    >
      {l}
    </div>
  );
}

export default function DecentralizationSpectrum() {
  const [v, setV] = useState(40);
  const x = v / 100;
  const metrics = useMemo(
    () => ({
      debug: Math.round(100 * (1 - x)),
      resil: Math.round(100 * x),
      coord: Math.round(100 * 4 * x * (1 - x)),
      privacy: Math.round(100 * x),
    }),
    [x]
  );
  const topo =
    v < 25 ? (
      <>
        <E x1={140} y1={70} x2={140} y2={28} />
        <E x1={140} y1={70} x2={228} y2={70} />
        <E x1={140} y1={70} x2={140} y2={112} />
        <E x1={140} y1={70} x2={52} y2={70} />
        <N x={140} y={70} l="H" />
        <N x={140} y={28} l="A" />
        <N x={228} y={70} l="B" />
        <N x={140} y={112} l="C" />
        <N x={52} y={70} l="D" />
      </>
    ) : v < 50 ? (
      <>
        <E x1={140} y1={24} x2={80} y2={52} />
        <E x1={140} y1={24} x2={200} y2={52} />
        <E x1={80} y1={52} x2={60} y2={96} />
        <E x1={80} y1={52} x2={100} y2={96} />
        <E x1={200} y1={52} x2={180} y2={96} />
        <E x1={200} y1={52} x2={220} y2={96} />
        <N x={140} y={24} l="R" />
        <N x={80} y={52} l="S1" />
        <N x={200} y={52} l="S2" />
        <N x={60} y={96} l="w1" />
        <N x={100} y={96} l="w2" />
        <N x={180} y={96} l="w3" />
        <N x={220} y={96} l="w4" />
      </>
    ) : v < 75 ? (
      <>
        <E x1={140} y1={30} x2={220} y2={60} />
        <E x1={220} y1={60} x2={200} y2={110} />
        <E x1={200} y1={110} x2={80} y2={110} />
        <E x1={80} y1={110} x2={60} y2={60} />
        <E x1={60} y1={60} x2={140} y2={30} />
        <E x1={140} y1={30} x2={200} y2={110} />
        <E x1={60} y1={60} x2={220} y2={60} />
        <N x={140} y={30} l="1" />
        <N x={220} y={60} l="2" />
        <N x={200} y={110} l="3" />
        <N x={80} y={110} l="4" />
        <N x={60} y={60} l="5" />
      </>
    ) : (
      <>
        <E x1={70} y1={40} x2={210} y2={40} />
        <E x1={70} y1={40} x2={70} y2={100} />
        <E x1={70} y1={40} x2={210} y2={100} />
        <E x1={210} y1={40} x2={210} y2={100} />
        <E x1={70} y1={100} x2={210} y2={100} />
        <E x1={210} y1={40} x2={70} y2={100} />
        <N x={70} y={40} l="a" />
        <N x={210} y={40} l="b" />
        <N x={70} y={100} l="c" />
        <N x={210} y={100} l="d" />
      </>
    );

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-[#0d0e14] p-3">
        <div className="mb-2 flex justify-between text-xs text-accent">
          <span>Centralized</span>
          <span>{v}</span>
          <span>Decentralized</span>
        </div>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} className="w-full accent-[#6c63ff]" />
        <div className="relative mx-auto mt-2 h-[130px] w-[280px]">{topo}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["Debuggability", metrics.debug],
          ["Resilience", metrics.resil],
          ["Coordination Cost", metrics.coord],
          ["Privacy", metrics.privacy],
        ].map(([label, pct]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-[#0d0e14] p-2">
            <div className="mb-1 flex justify-between text-xs text-accent">
              <span>{label}</span>
              <span>{pct as number}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#1a1c25]">
              <div className="h-full rounded-full bg-[#6c63ff]" style={{ width: `${pct as number}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
