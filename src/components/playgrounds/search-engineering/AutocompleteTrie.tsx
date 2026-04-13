import { useState, useMemo } from "react";
import "../ChartTheme";

interface TrieNode { children: Map<string, TrieNode>; end: boolean; pop: number }

function makeTrie(words: { w: string; p: number }[]): TrieNode {
  const root: TrieNode = { children: new Map(), end: false, pop: 0 };
  for (const { w, p } of words) {
    let n = root;
    for (const ch of w.toLowerCase()) {
      if (!n.children.has(ch)) n.children.set(ch, { children: new Map(), end: false, pop: 0 });
      n = n.children.get(ch)!;
    }
    n.end = true;
    n.pop += p;
  }
  return root;
}

function suggest(root: TrieNode, prefix: string, limit = 8): { word: string; pop: number }[] {
  let n = root;
  for (const ch of prefix.toLowerCase()) {
    if (!n.children.has(ch)) return [];
    n = n.children.get(ch)!;
  }
  const results: { word: string; pop: number }[] = [];
  const collect = (node: TrieNode, path: string) => {
    if (node.end) results.push({ word: path, pop: node.pop });
    for (const [ch, child] of node.children) collect(child, path + ch);
  };
  collect(n, prefix.toLowerCase());
  return results.sort((a, b) => b.pop - a.pop).slice(0, limit);
}

const CORPUS = [
  { w: "python", p: 95 }, { w: "pytorch", p: 60 }, { w: "pandas", p: 70 },
  { w: "programming", p: 50 }, { w: "parallel", p: 30 }, { w: "machine learning", p: 85 },
  { w: "matplotlib", p: 40 }, { w: "model", p: 55 }, { w: "mongodb", p: 35 },
  { w: "search", p: 80 }, { w: "sorting", p: 25 }, { w: "semantic", p: 45 },
  { w: "react", p: 75 }, { w: "redis", p: 50 }, { w: "ranking", p: 60 },
  { w: "retrieval", p: 65 }, { w: "rag", p: 70 }, { w: "replication", p: 30 },
];

export default function AutocompleteTrie() {
  const [prefix, setPrefix] = useState("");
  const trie = useMemo(() => makeTrie(CORPUS), []);
  const results = useMemo(() => (prefix.length > 0 ? suggest(trie, prefix) : []), [trie, prefix]);
  const maxPop = results.length ? Math.max(...results.map((r) => r.pop)) : 1;

  return (
    <div>
      <div className="mb-3">
        <input
          type="text" value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono"
          placeholder="Type a prefix (e.g. 'py', 'se', 'ra')"
        />
      </div>
      {prefix.length > 0 && results.length === 0 && (
        <p className="text-xs text-text-secondary italic">No matches for "{prefix}"</p>
      )}
      <div className="space-y-1.5">
        {results.map((r, i) => (
          <div key={r.word} className="flex items-center gap-3 bg-[#0d0e14] border border-border rounded-lg px-4 py-2">
            <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
            <span className="text-sm text-white font-mono flex-1">
              <span className="text-accent">{prefix.toLowerCase()}</span>
              {r.word.slice(prefix.length)}
            </span>
            <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(r.pop / maxPop) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono text-text-secondary w-6 text-right">{r.pop}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-text-secondary">
        {CORPUS.length} words indexed · trie prefix matching · ranked by popularity
      </div>
    </div>
  );
}
