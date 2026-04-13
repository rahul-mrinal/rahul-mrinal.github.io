import { useMemo, useState } from "react";

type LMH = "Low" | "Med" | "High";
type Det = "Yes" | "Partial" | "No";
type Row = { pattern: string; control: string; det: Det; route: LMH; par: LMH; qual: number; comp: LMH };
const R: Row[] = [
  { pattern: "Sequential", control: "Central", det: "Yes", route: "Low", par: "Low", qual: 6, comp: "Low" },
  { pattern: "Selector", control: "Delegated", det: "Partial", route: "Med", par: "Med", qual: 7, comp: "Low" },
  { pattern: "Handoff", control: "Paired", det: "Partial", route: "Med", par: "Low", qual: 6, comp: "Med" },
  { pattern: "Hierarchical", control: "Layered", det: "Partial", route: "Med", par: "Med", qual: 8, comp: "Med" },
  { pattern: "Debate", control: "Distributed", det: "No", route: "High", par: "High", qual: 9, comp: "High" },
  { pattern: "Ensemble", control: "Distributed", det: "No", route: "High", par: "High", qual: 8, comp: "Med" },
  { pattern: "Graph", control: "Structured", det: "Yes", route: "Med", par: "Med", qual: 8, comp: "High" },
  { pattern: "Blackboard", control: "Shared", det: "Partial", route: "Med", par: "High", qual: 7, comp: "High" },
  { pattern: "Market", control: "Auction", det: "No", route: "High", par: "High", qual: 7, comp: "High" },
  { pattern: "Federated", control: "Partitioned", det: "Partial", route: "High", par: "Med", qual: 7, comp: "High" },
];
const O: Record<string, number> = { Low: 0, Med: 1, High: 2, Yes: 2, Partial: 1, No: 0 };
type Col = keyof Row;
const COLS: { key: Col; label: string }[] = [
  { key: "pattern", label: "Pattern" },
  { key: "control", label: "Control" },
  { key: "det", label: "Deterministic?" },
  { key: "route", label: "Routing Cost" },
  { key: "par", label: "Parallelism" },
  { key: "qual", label: "Quality" },
  { key: "comp", label: "Complexity" },
];

export default function PatternMatrix() {
  const [sortKey, setSortKey] = useState<Col>("pattern");
  const [asc, setAsc] = useState(true);
  const [fil, setFil] = useState<"all" | "lowc" | "highp" | "det">("all");
  const rows = useMemo(() => {
    let x = [...R];
    if (fil === "lowc") x = x.filter((r) => r.comp === "Low");
    if (fil === "highp") x = x.filter((r) => r.par === "High");
    if (fil === "det") x = x.filter((r) => r.det === "Yes");
    const mul = asc ? 1 : -1;
    x.sort((a, b) => {
      if (sortKey === "qual") return (a.qual - b.qual) * mul;
      const sa = String(a[sortKey]),
        sb = String(b[sortKey]);
      const oa = O[sa],
        ob = O[sb];
      if (oa !== undefined && ob !== undefined) return (oa - ob) * mul;
      return sa.localeCompare(sb) * mul;
    });
    return x;
  }, [sortKey, asc, fil]);
  const hdr = (key: Col, label: string) => (
    <th key={key} className="text-left p-1.5 border-b border-border">
      <button
        type="button"
        className={sortKey === key ? "text-accent" : "text-text-secondary"}
        onClick={() => {
          if (sortKey === key) setAsc(!asc);
          else {
            setSortKey(key);
            setAsc(true);
          }
        }}
      >
        {label}
        {sortKey === key ? (asc ? " ▲" : " ▼") : ""}
      </button>
    </th>
  );
  return (
    <div className="rounded-lg border border-border bg-[#0d0e14] p-2 space-y-2">
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["all", "All"],
            ["lowc", "Low Complexity"],
            ["highp", "High Parallelism"],
            ["det", "Deterministic"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFil(k)} className={`px-2 py-0.5 text-[10px] rounded border ${fil === k ? "border-accent text-accent" : "border-border text-text-secondary"}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] text-text-secondary border-collapse">
          <thead>
            <tr className="bg-black/30">{COLS.map((c) => hdr(c.key, c.label))}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pattern} className="border-b border-border/60 hover:bg-black/20">
                <td className="p-1 font-medium text-accent">{r.pattern}</td>
                <td className="p-1">{r.control}</td>
                <td className="p-1">{r.det}</td>
                <td className="p-1">{r.route}</td>
                <td className="p-1">{r.par}</td>
                <td className="p-1">{r.qual}</td>
                <td className="p-1">{r.comp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
