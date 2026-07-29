import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 my-5 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-700">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
          {language || "TEXT"}
        </span>

        <CopyToClipboard
          text={value}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <button className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied!" : "Copy"}
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
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function ChatMessage({
  role,
  message,
  thinking = false,
}) {
  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
  };

  return (
    <div
      className={`flex gap-4 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {role === "assistant" && (
        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-5 py-4 ${
          role === "assistant"
            ? "bg-[#111827] text-gray-100"
            : "bg-violet-600 text-white"
        }`}
      >
        {thinking ? (
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        ) : (
          <>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (!inline) {
                      return (
                        <CodeBlock
                          language={match?.[1]}
                          value={String(children).replace(/\n$/, "")}
                        />
                      );
                    }

                    return (
                      <code className="bg-slate-800 rounded px-1 py-0.5">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>
            </div>

            {role === "assistant" && (
              <div className="flex gap-3 mt-4 text-gray-400">
                <button
                  onClick={copyMessage}
                  className="hover:text-white transition"
                >
                  <Copy size={16} />
                </button>

                <button className="hover:text-white transition">
                  <ThumbsUp size={16} />
                </button>

                <button className="hover:text-white transition">
                  <ThumbsDown size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {role === "user" && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}