import { useRef, useState, useEffect } from "react";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

import { generateResponse } from "../services/geminiService";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      message: `Hello Akanksha 👋

Welcome to Nyxora AI.

How can I help you today?`,
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      message: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsThinking(true);

    try {
      const reply = await generateResponse(text);

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        message: reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          message: "Something went wrong while generating the response.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050816]">
      <ChatSidebar />

      <div className="flex flex-col flex-1">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              message={msg.message}
            />
          ))}

          {isThinking && (
            <ChatMessage
              role="assistant"
              message="Nyxora AI is thinking..."
              thinking
            />
          )}

          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}