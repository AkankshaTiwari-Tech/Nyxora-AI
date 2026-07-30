import { useState } from "react";
import { Send, Square } from "lucide-react";

export default function MessageInput({
  onSend,
  onStop,
  loading,
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || loading) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="border-t border-gray-800 bg-[#0B1120] p-4">
      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Message Nyxora AI..."
          value={message}
          disabled={loading}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1 rounded-xl border border-gray-700 bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-indigo-500 disabled:opacity-60"
        />

        {loading ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 font-semibold transition hover:bg-red-700"
          >
            <Square size={18} />
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold transition hover:bg-indigo-700"
          >
            <Send size={18} />
            Send
          </button>
        )}

      </div>
    </div>
  );
}