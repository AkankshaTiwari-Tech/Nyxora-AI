import { useState } from "react";
import {
  sendMessage,
  stopGeneration,
} from "../services/chatService";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! I'm Nyxora AI.\nHow can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const send = async (message) => {
    if (!message.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    setLoading(true);

    try {
      await sendMessage(message, (streamedText) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: streamedText,
          };

          return updated;
        });
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: "❌ Failed to connect to Nyxora AI.",
          };

          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async (assistantIndex) => {
    if (loading) return;

    const previousUser = messages[assistantIndex - 1];

    if (!previousUser || previousUser.role !== "user") return;

    setLoading(true);

    setMessages((prev) => {
      const updated = [...prev];

      updated[assistantIndex] = {
        role: "assistant",
        content: "",
      };

      return updated;
    });

    try {
      await sendMessage(previousUser.content, (streamedText) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[assistantIndex] = {
            role: "assistant",
            content: streamedText,
          };

          return updated;
        });
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];

          updated[assistantIndex] = {
            role: "assistant",
            content: "❌ Failed to regenerate response.",
          };

          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const stop = () => {
    stopGeneration();
    setLoading(false);
  };

  return {
    messages,
    setMessages,
    loading,
    send,
    regenerate,
    stop,
  };
}