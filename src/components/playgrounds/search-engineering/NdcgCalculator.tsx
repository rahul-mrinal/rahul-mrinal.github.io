import { useState, useMemo } from "react";
import "../ChartTheme";

function dcg(rels: number[]) {
  let s = 0;
  rels.forEach((r, i) => { s += (Math.pow(2, r) - 1) / Math.log2(i + 2); });
  return s;
}

const GRADE_COLORS = ["text-text-secondary", "text-[#ffd93d]", "text-accent", "text-[#00c9a7]"];
const GRADE_BG = ["bg-border", "bg-[#ffd93d]", "bg-accent", "bg-[#00c9a7]"];

export default function NdcgCalculator() {
  const [grades, setGrades] = useState([3, 2, 0, 1, 0]);

  const { myDCG, idealDCG, ndcg, ideal } = useMemo(() => {
    const myDCG = dcg(grades);
    const ideal = [...grades].sort((a, b) => b - a);
    const idealDCG = dcg(ideal);
    return { myDCG, idealDCG, ndcg: idealDCG > 0 ? myDCG / idealDCG : 0, ideal };
  }, [grades]);

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {grades.map((g, i) => (
          <div key={i} className="text-center">
            <label className="text-xs font-medium text-text-secondary block mb-1">
              Rank {i + 1}
            </label>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3].map((v) => (
                <button key={v} onClick={() => {
                  const next = [...grades];
                  next[i] = v;
                  setGrades(next);
                }}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    g === v ? `${GRADE_BG[v]} text-white` : "bg-[#0d0e14] border border-border text-text-secondary hover:border-accent"
                  }`}
                >{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">DCG@5</div>
          <div className="text-lg font-bold font-mono text-accent">{myDCG.toFixed(3)}</div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">IDCG@5</div>
          <div className="text-lg font-bold font-mono text-[#ffd93d]">{idealDCG.toFixed(3)}</div>
        </div>
        <div className="bg-[#0d0e14] border border-border rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">NDCG@5</div>
          <div className="text-lg font-bold font-mono text-[#00c9a7]">{ndcg.toFixed(3)}</div>
        </div>
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-secondary">
              <th className="text-left py-1">Pos</th>
              <th className="text-left">Rel</th>
              <th className="text-left">2^rel-1</th>
              <th className="text-left">log₂(i+1)</th>
              <th className="text-right">Gain</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => {
              const num = Math.pow(2, g) - 1;
              const den = Math.log2(i + 2);
              return (
                <tr key={i} className="border-t border-border/50">
                  <td className="py-1 text-text-secondary">{i + 1}</td>
                  <td className={`font-bold ${GRADE_COLORS[g]}`}>{g}</td>
                  <td className="text-text-secondary">{num.toFixed(0)}</td>
                  <td className="text-text-secondary">{den.toFixed(3)}</td>
                  <td className="text-right font-mono text-accent">{(num / den).toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-text-secondary mt-2 pt-2 border-t border-border/50">
          Ideal: [{ideal.join(", ")}] &rarr; IDCG = {idealDCG.toFixed(3)}
        </p>
      </div>
    </div>
  );
}
