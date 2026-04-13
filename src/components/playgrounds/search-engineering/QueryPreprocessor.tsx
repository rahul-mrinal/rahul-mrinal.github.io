import { useState, useMemo } from "react";

const STOPS = new Set(["a","an","the","is","are","was","were","be","to","of","in","for","on","with","at","by","and","or","but","not","so","if","this","that","it","its","i","me","my","we","you","your","he","she","they","them","their","very","just","too"]);
const STEMS: Record<string, string> = { running:"run",quickly:"quick",best:"best",restaurants:"restaurant",learning:"learn",algorithms:"algorithm",searching:"search",fixing:"fix",machines:"machin",processing:"process" };
const SPELL: Record<string, string> = { restauraunts:"restaurants",recieve:"receive",definately:"definitely",seperate:"separate",pyhton:"python",teh:"the",adn:"and" };
const SYNS: Record<string, string[]> = { run:["execute","sprint"],quick:["fast","rapid"],best:["top","optimal"],restaurant:["eatery","diner"],fix:["repair","debug"],learn:["study","train"],search:["find","query"] };

export default function QueryPreprocessor() {
  const [raw, setRaw] = useState("Running quickly to the BEST restauraunts in New York");

  const steps = useMemo(() => {
    const tokens = (raw.match(/[\w'$]+|[^\s\w]/g) || []);
    const lowered = tokens.map((t) => t.toLowerCase());
    const spelled = lowered.map((t) => SPELL[t] || t);
    const spellFlags = lowered.map((t, i) => t !== spelled[i]);
    const afterStop = spelled.map((t) => ({ t, removed: STOPS.has(t) }));
    const kept = afterStop.filter((x) => !x.removed).map((x) => x.t);
    const stemmed = kept.map((t) => STEMS[t] || t);
    const expanded: string[] = [];
    stemmed.forEach((t) => { if (SYNS[t]) expanded.push(`+[${SYNS[t].join(", ")}]`); });
    return { tokens, lowered, spelled, spellFlags, afterStop, kept, stemmed, expanded };
  }, [raw]);

  const Tag = ({ children, cls }: { children: React.ReactNode; cls: string }) => (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono mr-1 mb-1 ${cls}`}>{children}</span>
  );

  return (
    <div>
      <input type="text" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="Type a query..."
        className="w-full bg-[#0d0e14] border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent font-mono mb-3" />
      <div className="space-y-2 text-xs">
        {[
          { label: "1. Tokenize", items: steps.tokens.map((t) => <Tag key={t} cls="bg-accent/10 text-accent">{t}</Tag>) },
          { label: "2. Lowercase", items: steps.lowered.map((t) => <Tag key={t} cls="bg-accent/10 text-accent">{t}</Tag>) },
          { label: "3. Spell Fix", items: steps.spelled.map((t, i) =>
            steps.spellFlags[i]
              ? <Tag key={i} cls="bg-green-500/15 text-green-400">{t}<sup className="text-red-400 ml-0.5">was:{steps.lowered[i]}</sup></Tag>
              : <Tag key={i} cls="bg-accent/10 text-accent">{t}</Tag>
          )},
          { label: "4. Stop words", items: steps.afterStop.map((x, i) =>
            <Tag key={i} cls={x.removed ? "bg-red-500/15 text-red-400 line-through" : "bg-accent/10 text-accent"}>{x.t}</Tag>
          )},
          { label: "5. Stem", items: steps.stemmed.map((t, i) =>
            t !== steps.kept[i]
              ? <Tag key={i} cls="bg-yellow-500/15 text-yellow-400">{t}<sup className="text-text-secondary ml-0.5">←{steps.kept[i]}</sup></Tag>
              : <Tag key={i} cls="bg-accent/10 text-accent">{t}</Tag>
          )},
          { label: "6. Expand", items: [
            ...steps.stemmed.map((t) => <Tag key={t} cls="bg-accent/10 text-accent">{t}</Tag>),
            ...steps.expanded.map((e) => <Tag key={e} cls="bg-yellow-500/15 text-yellow-400">{e}</Tag>),
          ]},
        ].map((step) => (
          <div key={step.label} className="bg-[#0d0e14] border border-border rounded-lg px-3 py-2">
            <div className="text-text-secondary font-semibold mb-1">{step.label}</div>
            <div className="flex flex-wrap">{step.items}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
