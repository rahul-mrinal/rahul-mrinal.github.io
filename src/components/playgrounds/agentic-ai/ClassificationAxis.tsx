import { useMemo, useState } from "react";

const CONTROL = ["Centralized", "Decentralized", "Hybrid"] as const;
const TOPOLOGY = ["Star", "Mesh", "Pipeline", "Broadcast", "Blackboard"] as const;
const REL = ["Peer", "Hierarchical", "Competitive", "Mixed"] as const;

type C = (typeof CONTROL)[number];
type T = (typeof TOPOLOGY)[number];
type R = (typeof REL)[number];

const PATTERNS: Record<string, string> = {
  "Centralized|Star|Hierarchical": "Manager-Worker",
  "Decentralized|Mesh|Peer": "Swarm Intelligence",
  "Hybrid|Blackboard|Mixed": "Layered Blackboard",
  "Centralized|Pipeline|Peer": "Assembly Line",
};

function PillGroup<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly K[];
  value: K | null;
  onChange: (v: K) => void;
}) {
  return (
    <div className="mb-3">
      <span className="text-xs font-semibold text-text-secondary block mb-1">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              className="sr-only peer"
              name={label}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-mono border border-border bg-[#0d0e14] text-text-secondary peer-checked:border-accent peer-checked:text-accent transition">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ClassificationAxis() {
  const [control, setControl] = useState<C | null>(null);
  const [topology, setTopology] = useState<T | null>(null);
  const [rel, setRel] = useState<R | null>(null);

  const formula = useMemo(() => {
    if (!control || !topology || !rel) return null;
    return `${control} + ${topology} + ${rel}`;
  }, [control, topology, rel]);

  const patternName = useMemo(() => {
    if (!control || !topology || !rel) return null;
    const key = `${control}|${topology}|${rel}`;
    return PATTERNS[key] ?? "Custom Configuration";
  }, [control, topology, rel]);

  const complete = control && topology && rel;

  return (
    <div className="space-y-2">
      <PillGroup label="Axis 1 (Control)" options={CONTROL} value={control} onChange={setControl} />
      <PillGroup label="Axis 2 (Topology)" options={TOPOLOGY} value={topology} onChange={setTopology} />
      <PillGroup label="Axis 3 (Relationships)" options={REL} value={rel} onChange={setRel} />
      {complete && formula && patternName && (
        <div className="bg-[#0d0e14] border border-accent rounded-lg px-4 py-3 mt-3 transition-opacity duration-200">
          <span className="text-xs font-semibold text-text-secondary block mb-1">Pattern</span>
          <div className="text-accent font-mono text-sm mb-2">{patternName}</div>
          <span className="text-xs text-text-secondary font-mono">{formula}</span>
        </div>
      )}
    </div>
  );
}
