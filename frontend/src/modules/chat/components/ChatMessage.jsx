import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 border-b border-slate-700">
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

export default function ChatMessage({
  role,
  message,
  thinking = false,
}) {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-4 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {role === "assistant" && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-3xl px-6 py-5 shadow-md ${
          role === "assistant"
            ? "bg-[#111827] text-gray-100"
            : "bg-violet-600 text-white"
        }`}
      >
        {thinking ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
            <span
              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: "0.4s" }}
            ></span>

            <span className="ml-3 text-sm text-gray-400">
              Nyxora AI is thinking...
            </span>
          </div>
        ) : (
          <>
            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-200 prose-p:leading-8 prose-li:text-gray-200 prose-strong:text-white prose-a:text-violet-400 prose-blockquote:border-violet-500 prose-blockquote:text-gray-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
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
                      <code className="rounded bg-slate-800 px-2 py-1 text-pink-300">
                        {children}
                      </code>
                    );
                  },

                  table({ children }) {
                    return (
                      <div className="my-6 overflow-x-auto rounded-xl border border-slate-700">
                        <table className="w-full border-collapse">
                          {children}
                        </table>
                      </div>
                    );
                  },

                  th({ children }) {
                    return (
                      <th className="border border-slate-700 bg-slate-800 p-3 text-left">
                        {children}
                      </th>
                    );
                  },

                  td({ children }) {
                    return (
                      <td className="border border-slate-700 p-3">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>

              {role === "assistant" && (
                <span className="animate-pulse text-violet-400">▌</span>
              )}
            </div>

            {role === "assistant" && (
              <div className="mt-5 flex items-center gap-4 border-t border-slate-700 pt-4 text-gray-400">
                <button
                  onClick={copyMessage}
                  className="transition hover:text-white"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>

                <button className="transition hover:text-green-400">
                  <ThumbsUp size={18} />
                </button>

                <button className="transition hover:text-red-400">
                  <ThumbsDown size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {role === "user" && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}