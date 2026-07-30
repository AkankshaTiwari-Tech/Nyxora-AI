import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import CodeBlock from "./CodeBlock";

export default function MessageContent({ message, role }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-200 prose-p:leading-8 prose-li:text-gray-200 prose-strong:text-white prose-a:text-violet-400 prose-blockquote:border-violet-500 prose-blockquote:text-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },

          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");

            if (match) {
              return (
                <CodeBlock
                  language={match[1]}
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
  );
}