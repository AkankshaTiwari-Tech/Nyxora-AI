import { useEffect, useRef, useState } from "react";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

import { generateResponse } from "../services/geminiService";

const createWelcomeMessages = () => [
  {
    id: Date.now(),
    role: "assistant",
    message: `Hello Akanksha 👋

Welcome to Nyxora AI.

How can I help you today?`,
  },
];

export default function Chat() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("nyxora-chats");

    if (savedChats) {
      return JSON.parse(savedChats);
    }

    return [
      {
        id: 1,
        title: "New Chat",
        messages: createWelcomeMessages(),
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const savedId = localStorage.getItem("nyxora-active-chat");

    return savedId ? Number(savedId) : 1;
  });

  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat?.messages, isThinking]);

  // Save chats
  useEffect(() => {
    localStorage.setItem("nyxora-chats", JSON.stringify(chats));
  }, [chats]);

  // Save active chat
  useEffect(() => {
    localStorage.setItem(
      "nyxora-active-chat",
      activeChatId.toString()
    );
  }, [activeChatId]);

  // If active chat doesn't exist anymore, select first chat
  useEffect(() => {
    if (!chats.length) return;

    const exists = chats.some(
      (chat) => chat.id === activeChatId
    );

    if (!exists) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: createWelcomeMessages(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsThinking(false);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length === 1) return;

    const updatedChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(updatedChats);

    if (activeChatId === chatId) {
      setActiveChatId(updatedChats[0].id);
    }
  };

  const handleRenameChat = (chatId, newTitle) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: newTitle,
            }
          : chat
      )
    );
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      message: text,
    };

    const aiMessage = {
      id: Date.now() + 1,
      role: "assistant",
      message: "",
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;

        return {
          ...chat,
          title:
            chat.title === "New Chat"
              ? text.slice(0, 30)
              : chat.title,
          messages: [...chat.messages, userMessage, aiMessage],
        };
      })
    );

    setIsThinking(true);

    try {
      await generateResponse(text, (streamText) => {
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeChatId) return chat;

            return {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === aiMessage.id
                  ? {
                      ...msg,
                      message: streamText,
                    }
                  : msg
              ),
            };
          })
        );
      });
    } catch {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat;

          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === aiMessage.id
                ? {
                    ...msg,
                    message:
                      "❌ Something went wrong while generating the response.",
                  }
                : msg
            ),
          };
        })
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050816]">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      <div className="flex flex-col flex-1">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {activeChat?.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              message={msg.message}
            />
          ))}

          {isThinking &&
            activeChat?.messages[
              activeChat.messages.length - 1
            ]?.message === "" && (
              <ChatMessage
                role="assistant"
                message=""
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