import { useEffect, useState } from "react";

const createWelcomeMessages = () => [
  {
    id: Date.now(),
    role: "assistant",
    message: `Hello Akanksha 👋

Welcome to Nyxora AI.

How can I help you today?`,
  },
];

export default function useChatHistory() {
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

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );

  useEffect(() => {
    localStorage.setItem(
      "nyxora-chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(
      "nyxora-active-chat",
      activeChatId.toString()
    );
  }, [activeChatId]);

  useEffect(() => {
    if (!chats.length) return;

    const exists = chats.some(
      (chat) => chat.id === activeChatId
    );

    if (!exists) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const newChat = () => {
    const chat = {
      id: Date.now(),
      title: "New Chat",
      messages: createWelcomeMessages(),
    };

    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const deleteChat = (chatId) => {
    if (chats.length === 1) return;

    const updated = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(updated);

    if (activeChatId === chatId) {
      setActiveChatId(updated[0].id);
    }
  };

  const renameChat = (chatId, title) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title,
            }
          : chat
      )
    );
  };

  return {
    chats,
    setChats,
    activeChat,
    activeChatId,
    setActiveChatId,
    newChat,
    selectChat,
    deleteChat,
    renameChat,
  };
}