import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, User, Bot } from "lucide-react";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={`flex gap-3 mb-8 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div
        className={`relative rounded-2xl px-5 py-4 shadow-lg max-w-4xl ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-[#111827] text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">
            {content}
          </p>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }) {
                  const match = /language-(\w+)/.exec(
                    className || ""
                  );

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-gray-900 px-1 py-0.5 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>

            <button
              onClick={copyMessage}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-700 transition"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}