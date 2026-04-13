import { useState, useMemo } from "react";

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp;
}

function traceback(dp: number[][], a: string, b: string) {
  const path = new Set<string>();
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    path.add(`${i},${j}`);
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { i--; j--; }
    else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) { i--; j--; }
    else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { i--; }
    else { j--; }
  }
  path.add("0,0");
  return path;
}

export default function EditDistanceCalculator() {
  const [wordA, setWordA] = useState("kitten");
  const [wordB, setWordB] = useState("sitting");

  const { dp, path, dist } = useMemo(() => {
    const a = wordA.toLowerCase(), b = wordB.toLowerCase();
    const dp = levenshtein(a, b);
    const path = traceback(dp, a, b);
    return { dp, path, dist: dp[a.length][b.length] };
  }, [wordA, wordB]);

  const a = wordA.toLowerCase(), b = wordB.toLowerCase();

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Word A</label>
          <input type="text" value={wordA} maxLength={10} onChange={(e) => setWordA(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Word B</label>
          <input type="text" value={wordB} maxLength={10} onChange={(e) => setWordB(e.target.value)}
            className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono" />
        </div>
      </div>
      <div className="bg-[#0d0e14] border border-border rounded-lg p-3 mb-3 text-center">
        <span className="text-xs text-text-secondary">Levenshtein Distance:</span>
        <span className="text-accent font-mono font-bold text-xl ml-2">{dist}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse font-mono text-xs mx-auto">
          <thead>
            <tr>
              <td className="w-8 h-8 text-center border border-border bg-[#1a1c25] text-accent font-bold" />
              <td className="w-8 h-8 text-center border border-border bg-[#1a1c25] text-accent font-bold" />
              {b.split("").map((c, j) => (
                <td key={j} className="w-8 h-8 text-center border border-border bg-[#1a1c25] text-accent font-bold">{c}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td className="w-8 h-8 text-center border border-border bg-[#1a1c25] text-accent font-bold">
                  {i > 0 ? a[i - 1] : ""}
                </td>
                {row.map((val, j) => {
                  const isFinal = i === a.length && j === b.length;
                  const onPath = path.has(`${i},${j}`);
                  return (
                    <td key={j} className={`w-8 h-8 text-center border border-border ${
                      isFinal ? "bg-accent text-white font-bold" : onPath ? "bg-accent/25 text-white font-bold" : "text-text-secondary"
                    }`}>{val}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
