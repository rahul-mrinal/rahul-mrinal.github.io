import { useState, useRef, useEffect, useCallback } from "react";

const SCENARIOS = ["Sorting function", "REST API design", "SQL query"] as const;
type Sc = (typeof SCENARIOS)[number];

const SCRIPT: Record<Sc, [string, string][][]> = {
  "Sorting function": [
    [["<b>Propose</b><br>Quicksort with random pivot.", "-"], ["<b>Propose</b><br>Quicksort with random pivot.", "<b>Critique</b><br>O(n²) skewed data; unstable."], ["<b>Revise</b><br>3-way partition + insertion for small n.", "<b>Critique</b><br>O(n²) skewed data; unstable."]],
    [["<b>Propose</b><br>Hybrid introsort cap depth.", "-"], ["<b>Propose</b><br>Hybrid introsort cap depth.", "<b>Critique</b><br>Heap fallback costlier cache."], ["<b>Revise</b><br>Tune pivot sampling + SIMD copy.", "<b>Critique</b><br>Heap fallback costlier cache."]],
    [["<b>Propose</b><br>Document invariants + fuzz tests.", "-"], ["<b>Propose</b><br>Document invariants + fuzz tests.", "<b>Critique</b><br>Missing adversarial inputs."], ["<b>Revise</b><br>Add property tests + bounds proof.", "<b>Critique</b><br>Missing adversarial inputs."]],
  ],
  "REST API design": [
    [["<b>Propose</b><br>Versioned /v1 JSON + HATEOAS-lite.", "-"], ["<b>Propose</b><br>Versioned /v1 JSON + HATEOAS-lite.", "<b>Critique</b><br>Idempotency keys missing."], ["<b>Revise</b><br>Idempotency-Key + 409 conflict map.", "<b>Critique</b><br>Idempotency keys missing."]],
    [["<b>Propose</b><br>JWT stateless auth.", "-"], ["<b>Propose</b><br>JWT stateless auth.", "<b>Critique</b><br>Revocation story weak."], ["<b>Revise</b><br>Short TTL + refresh rotation.", "<b>Critique</b><br>Revocation story weak."]],
    [["<b>Propose</b><br>OpenAPI + strict schemas.", "-"], ["<b>Propose</b><br>OpenAPI + strict schemas.", "<b>Critique</b><br>Error model inconsistent."], ["<b>Revise</b><br>RFC7807 problem+json everywhere.", "<b>Critique</b><br>Error model inconsistent."]],
  ],
  "SQL query": [
    [["<b>Propose</b><br>CTE + window for ranks.", "-"], ["<b>Propose</b><br>CTE + window for ranks.", "<b>Critique</b><br>Full scan risk on large fact."], ["<b>Revise</b><br>Predicates on partition key + covering idx.", "<b>Critique</b><br>Full scan risk on large fact."]],
    [["<b>Propose</b><br>LEFT JOIN denormalized dims.", "-"], ["<b>Propose</b><br>LEFT JOIN denormalized dims.", "<b>Critique</b><br>NULL fan-out duplicates."], ["<b>Revise</b><br>Semi-join + EXISTS filter.", "<b>Critique</b><br>NULL fan-out duplicates."]],
    [["<b>Propose</b><br>Scalar subselect in SELECT.", "-"], ["<b>Propose</b><br>Scalar subselect in SELECT.", "<b>Critique</b><br>Correlated N+1 pattern."], ["<b>Revise</b><br>LATERAL + LIMIT 1 once.", "<b>Critique</b><br>Correlated N+1 pattern."]],
  ],
};
const Q = [0, 35, 65, 92];
const BADGE = '<div class="mt-2 inline-block px-2 py-0.5 rounded bg-[#00c9a7]/20 text-[#00c9a7] text-[10px] font-bold">APPROVED</div>';

export default function DebateSimulator() {
  const [sc, setSc] = useState<Sc>("Sorting function");
  const [run, setRun] = useState(false);
  const [round, setRound] = useState(0);
  const [ql, setQl] = useState(0);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = useCallback(() => {
    t.current.forEach(clearTimeout);
    t.current = [];
  }, []);
  useEffect(() => () => clear(), [clear]);

  const start = () => {
    clear();
    setRun(true);
    setDone(false);
    setQl(0);
    const seq = SCRIPT[sc];
    let i = 0;
    const step = () => {
      if (i >= 9) {
        setRun(false);
        setDone(true);
        const [, R] = seq[2][2];
        setRight(R + BADGE);
        return;
      }
      const r = Math.floor(i / 3);
      const p = i % 3;
      const [L, R] = seq[r][p];
      setLeft(L);
      setRight(R);
      setRound(r + 1);
      if (p === 2) setQl(Q[r + 1]);
      i++;
      t.current.push(setTimeout(step, 850));
    };
    t.current.push(setTimeout(step, 200));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-[10px] text-text-secondary block mb-1">Scenario</label>
          <select value={sc} onChange={(e) => setSc(e.target.value as Sc)} className="bg-[#0d0e14] border border-border rounded-lg px-2 py-1.5 text-xs text-white accent-[#6c63ff]">
            {SCENARIOS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <button type="button" disabled={run} onClick={start} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white disabled:opacity-50">
          Start Debate
        </button>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
        <div className="bg-[#0d0e14] border-2 border-accent rounded-lg p-2 min-h-[100px]">
          <div className="text-[10px] font-semibold text-accent mb-1">Proposer</div>
          <div className="text-[11px] text-text-secondary leading-snug [&_b]:text-white" dangerouslySetInnerHTML={{ __html: left || "-" }} />
        </div>
        <div className="flex flex-col items-center justify-center px-1">
          <div className="text-[10px] text-text-secondary">Round</div>
          <div className="text-lg font-mono font-bold text-accent">{run || done ? round : 0}</div>
        </div>
        <div className="bg-[#0d0e14] border-2 border-[#ff6b6b] rounded-lg p-2 min-h-[100px]">
          <div className="text-[10px] font-semibold text-[#ff6b6b] mb-1">Critic</div>
          <div className="text-[11px] text-text-secondary leading-snug [&_b]:text-white" dangerouslySetInnerHTML={{ __html: right || "-" }} />
        </div>
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-2">
        <div className="flex justify-between text-[10px] text-text-secondary mb-1">
          <span>Quality</span>
          <span className="text-accent font-mono">{ql}%</span>
        </div>
        <div className="h-2 rounded bg-black/40 border border-border overflow-hidden">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${ql}%` }} />
        </div>
      </div>
    </div>
  );
}
