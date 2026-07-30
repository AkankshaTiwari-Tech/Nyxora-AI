import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language,
  value,
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700 bg-[#161b22] px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {language || "TEXT"}
        </span>

        <CopyToClipboard
          text={value}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <button className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-gray-300 transition hover:bg-slate-700 hover:text-white">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </CopyToClipboard>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "20px",
          background: "#0d1117",
          fontSize: "14px",
          borderRadius: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}