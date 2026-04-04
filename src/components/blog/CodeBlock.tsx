import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = "python", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border my-6 group">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {filename && (
            <span className="text-xs text-text-secondary font-mono">{filename}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-text-secondary hover:text-white transition-colors p-1"
          aria-label="Copy code"
        >
          {copied ? <FiCheck size={14} className="text-accent-teal" /> : <FiCopy size={14} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "#12131a",
          fontSize: "0.85rem",
          lineHeight: "1.6",
        }}
        showLineNumbers
        lineNumberStyle={{
          color: "#3a3d4d",
          paddingRight: "1rem",
          minWidth: "2.5rem",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
