import {
  Bot,
  Copy,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";

export default function ChatMessage({
  role = "assistant",
  message = "",
  thinking = false,
}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex mb-8 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-4 max-w-4xl ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-indigo-600"
              : "bg-gradient-to-br from-indigo-600 to-purple-600"
          }`}
        >
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
        </div>

        <div>
          <div
            className={`rounded-2xl px-5 py-4 ${
              isUser
                ? "bg-indigo-600 text-white"
                : "bg-[#151B2F] border border-[#2A3452] text-gray-200"
            }`}
          >
            {thinking ? (
              <div className="flex items-center gap-2">
                <span>{message}</span>

                <div className="flex gap-1 ml-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            ) : (
              <p className="leading-8 whitespace-pre-wrap">
                {message}
              </p>
            )}
          </div>

          {!isUser && !thinking && (
            <div className="flex gap-3 mt-3 ml-2">
              <button className="text-gray-500 hover:text-white transition">
                <Copy size={17} />
              </button>

              <button className="text-gray-500 hover:text-green-400 transition">
                <ThumbsUp size={17} />
              </button>

              <button className="text-gray-500 hover:text-red-400 transition">
                <ThumbsDown size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}