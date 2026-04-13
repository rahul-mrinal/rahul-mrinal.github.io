import { useCallback, useRef, useState } from "react";

type Slot = "requirements" | "architecture" | "code" | "tests";

const AGENTS: { name: string; slot: Slot; value: string }[] = [
  { name: "Researcher", slot: "requirements", value: "OAuth2 + JWT, role-based access, session management" },
  { name: "Architect", slot: "architecture", value: "3-tier: React SPA → Express API → PostgreSQL + Redis" },
  { name: "Coder", slot: "code", value: "passport.js, JWT RS256, bcrypt, rate limiting" },
  { name: "Tester", slot: "tests", value: "42 tests, 94% coverage, unit + integration + e2e" },
];

type Entry = { t: string; kind: "READ" | "WRITE"; msg: string };
type Cell = { value: string; meta: string };

const empty: Cell = { value: "-", meta: "" };

export default function BlackboardDemo() {
  const [cells, setCells] = useState<Record<Slot, Cell>>({
    requirements: { ...empty },
    architecture: { ...empty },
    code: { ...empty },
    tests: { ...empty },
  });
  const [log, setLog] = useState<Entry[]>([]);
  const [pulse, setPulse] = useState<string | null>(null);
  const busy = useRef(false);
  const tRef = useRef<number | null>(null);

  const stamp = () => new Date().toLocaleTimeString();

  const push = useCallback((kind: "READ" | "WRITE", msg: string) => {
    setLog((l) => [...l.slice(-40), { t: stamp(), kind, msg }]);
  }, []);

  const onAgent = (a: (typeof AGENTS)[number]) => {
    if (busy.current) return;
    busy.current = true;
    setPulse(a.name);
    push("READ", `${a.name} scanned blackboard (${a.slot})`);
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => {
      const at = stamp();
      setCells((c) => ({
        ...c,
        [a.slot]: { value: a.value, meta: `Updated by ${a.name} at ${at}` },
      }));
      push("WRITE", `${a.name} wrote ${a.slot}`);
      setPulse(null);
      busy.current = false;
      tRef.current = null;
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="rounded-lg border border-border bg-[#0d0e14] p-3">
          <div className="mb-2 text-xs font-semibold text-accent">Blackboard</div>
          <div className="grid gap-2">
            {(["requirements", "architecture", "code", "tests"] as Slot[]).map((k) => (
              <div key={k} className="rounded border border-border bg-[#12131a] p-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">{k}</div>
                <div className="text-sm text-white">{cells[k].value}</div>
                {cells[k].meta && <div className="mt-1 text-[10px] text-accent">{cells[k].meta}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {AGENTS.map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => onAgent(a)}
              className={`rounded-lg border border-border bg-[#0d0e14] px-3 py-2 text-sm font-semibold text-accent transition-all hover:border-accent ${
                pulse === a.name ? "animate-pulse ring-2 ring-[#6c63ff]" : ""
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-32 overflow-y-auto rounded-lg border border-border bg-[#0d0e14] p-2 font-mono text-[10px] text-text-secondary">
        {log.map((e, i) => (
          <div key={i} className="text-accent">
            <span className="text-text-secondary">[{e.t}]</span> {e.kind} {e.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
