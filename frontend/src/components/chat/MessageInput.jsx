import { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="border-t border-gray-800 p-4 flex gap-3 bg-[#0B1120]">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 bg-[#111827] text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-indigo-500 disabled:opacity-50"
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-6 rounded-xl font-semibold transition"
      >
        {disabled ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}