import { useEffect, useRef, useState } from "react";

const TABS = [
  { id: "Star", blurb: "Single hub coordinates leaf agents." },
  { id: "Mesh", blurb: "Peer links; high resilience, more coordination." },
  { id: "Pipeline", blurb: "Linear stages; strict ordering of work." },
  { id: "Broadcast", blurb: "One source fans out to many listeners." },
  { id: "Blackboard", blurb: "Shared state mediates opportunistic agents." },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Edge({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      className="absolute pointer-events-none border-t border-dashed border-border"
      style={{ left: x1, top: y1, width: len, transform: `rotate(${ang}deg)`, transformOrigin: "0 0" }}
    />
  );
}

function Node({ x, y, label, bg }: { x: number; y: number; label: string; bg: string }) {
  return (
    <div
      className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border text-[9px] font-mono text-white shadow-sm"
      style={{ left: x, top: y, backgroundColor: bg }}
    >
      {label}
    </div>
  );
}

const C = { hub: "#6c63ff", a: "#00c9a7", b: "#ffd93d", c: "#ff6b6b", d: "#4dabf7" };

function StarView() {
  const hub = { x: 160, y: 110 };
  const leaves = [
    { x: 160, y: 38, l: "A1" },
    { x: 268, y: 110, l: "A2" },
    { x: 160, y: 182, l: "A3" },
    { x: 52, y: 110, l: "A4" },
  ];
  return (
    <>
      {leaves.map((p) => (
        <Edge key={p.l} x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} />
      ))}
      <Node x={hub.x} y={hub.y} label="Hub" bg={C.hub} />
      {leaves.map((p, i) => (
        <Node key={p.l} x={p.x} y={p.y} label={p.l} bg={[C.a, C.b, C.c, C.d][i]} />
      ))}
    </>
  );
}

function MeshView() {
  const pts = [
    { x: 160, y: 42, l: "A1" },
    { x: 52, y: 118, l: "A2" },
    { x: 108, y: 188, l: "A3" },
    { x: 212, y: 188, l: "A4" },
    { x: 268, y: 118, l: "A5" },
  ];
  const cols = [C.hub, C.a, C.b, C.c, C.d];
  const edges: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) edges.push([i, j]);
  return (
    <>
      {edges.map(([i, j]) => (
        <Edge key={`${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} />
      ))}
      {pts.map((p, i) => (
        <Node key={p.l} x={p.x} y={p.y} label={p.l} bg={cols[i]} />
      ))}
    </>
  );
}

function PipelineView() {
  const xs = [48, 98, 160, 222, 272];
  return (
    <>
      {xs.slice(0, -1).map((x, i) => (
        <Edge key={i} x1={x + 18} y1={110} x2={xs[i + 1] - 18} y2={110} />
      ))}
      {xs.map((x, i) => (
        <Node key={i} x={x} y={110} label={`N${i + 1}`} bg={[C.hub, C.a, C.b, C.c, C.d][i]} />
      ))}
    </>
  );
}

function BroadcastView() {
  const rx = [70, 130, 190, 250];
  return (
    <>
      {rx.map((x, i) => (
        <Edge key={i} x1={160} y1={52} x2={x} y2={138} />
      ))}
      <Node x={160} y={40} label="Src" bg={C.hub} />
      {rx.map((x, i) => (
        <Node key={i} x={x} y={150} label={`R${i + 1}`} bg={[C.a, C.b, C.c, C.d][i]} />
      ))}
    </>
  );
}

function BlackboardView() {
  const hub = { x: 160, y: 110 };
  const ag = [
    { x: 160, y: 38, l: "Ag1" },
    { x: 268, y: 110, l: "Ag2" },
    { x: 160, y: 182, l: "Ag3" },
    { x: 52, y: 110, l: "Ag4" },
  ];
  return (
    <>
      {ag.map((p) => (
        <Edge key={p.l} x1={p.x} y1={p.y} x2={hub.x} y2={hub.y} />
      ))}
      <Node x={hub.x} y={hub.y} label="State" bg={C.hub} />
      {ag.map((p, i) => (
        <Node key={p.l} x={p.x} y={p.y} label={p.l} bg={[C.a, C.b, C.c, C.d][i]} />
      ))}
    </>
  );
}

export default function TopologyVisualizer() {
  const [tab, setTab] = useState<TabId>("Star");
  const [fade, setFade] = useState(true);
  const swapRef = useRef<number | null>(null);
  const meta = TABS.find((t) => t.id === tab)!;

  useEffect(() => {
    setFade(true);
  }, [tab]);

  useEffect(() => () => {
    if (swapRef.current != null) window.clearTimeout(swapRef.current);
  }, []);

  const pickTab = (id: TabId) => {
    if (id === tab) return;
    if (swapRef.current != null) window.clearTimeout(swapRef.current);
    setFade(false);
    swapRef.current = window.setTimeout(() => {
      setTab(id);
      swapRef.current = null;
    }, 160);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pickTab(t.id)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-mono transition-colors duration-200 ${
              tab === t.id ? "bg-accent text-white" : "border border-border bg-[#0d0e14] text-text-secondary hover:border-accent"
            }`}
          >
            {t.id}
          </button>
        ))}
      </div>
      <div className="relative mx-auto h-[220px] max-w-md overflow-hidden rounded-lg border border-border bg-[#0d0e14]">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative mx-auto h-full w-full max-w-[320px]">
            {tab === "Star" && <StarView />}
            {tab === "Mesh" && <MeshView />}
            {tab === "Pipeline" && <PipelineView />}
            {tab === "Broadcast" && <BroadcastView />}
            {tab === "Blackboard" && <BlackboardView />}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-text-secondary">
        <span className="text-accent font-mono">{meta.id}</span>
        {" - "}
        {meta.blurb}
      </p>
    </div>
  );
}
