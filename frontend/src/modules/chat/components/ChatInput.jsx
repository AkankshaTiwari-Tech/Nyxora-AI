import { Paperclip, SendHorizontal } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="border-t border-[#20263B] bg-[#050816] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 bg-[#151B2F] border border-[#2B3350] rounded-3xl px-5 py-3 focus-within:border-indigo-500 transition-all duration-300">

          <button className="w-11 h-11 rounded-full hover:bg-[#202845] flex items-center justify-center transition">
            <Paperclip className="text-gray-400" size={20} />
          </button>

          <input
            type="text"
            placeholder="Ask Nyxora AI anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-lg"
          />

          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-600/30"
          >
            <SendHorizontal className="text-white" size={20} />
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Nyxora AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  );
}