import { useState } from "react";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import MessageInput from "../../components/chat/MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! I'm Nyxora AI.\nHow can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    // Show user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    // Temporary typing message
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "⏳ Nyxora AI is thinking...",
      },
    ]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: data.reply,
        };
        return updated;
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Failed to connect to AI.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#050816] text-white flex">
      <ChatSidebar />

      <div className="flex-1 flex flex-col">
        <ChatHeader />

        <ChatWindow messages={messages} />

        <MessageInput
          onSend={handleSend}
          disabled={loading}
        />
      </div>
    </div>
  );
}