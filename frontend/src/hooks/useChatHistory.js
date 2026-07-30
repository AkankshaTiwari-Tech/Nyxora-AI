import { useEffect, useState } from "react";
import {
  createChat,
  getChats,
  loadMessages,
  saveMessages,
  renameChat,
  updateChatTitle,
  deleteChat,
} from "../services/chatFirestoreService";

export default function useChatHistory() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    loadAllChats();
  }, []);

  async function loadAllChats() {
    try {
      const data = await getChats();

      setChats(data);

      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }

  async function newChat() {
    try {
      const id = await createChat();

      await loadAllChats();

      setActiveChatId(id);

      return id;
    } catch (error) {
      console.error(error);
    }
  }

  async function openChat(chatId) {
    try {
      setActiveChatId(chatId);

      return await loadMessages(chatId);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function saveChat(chatId, messages) {
    if (!chatId) return;

    try {
      await saveMessages(chatId, messages);

      const currentChat = chats.find((c) => c.id === chatId);

      if (
        currentChat &&
        currentChat.title === "New Chat"
      ) {
        const firstUserMessage = messages.find(
          (m) => m.role === "user"
        );

        if (firstUserMessage?.content) {
          let title = firstUserMessage.content.trim();

          if (title.length > 40) {
            title = title.slice(0, 40) + "...";
          }

          await updateChatTitle(chatId, title);
        }
      }

      await loadAllChats();
    } catch (error) {
      console.error(error);
    }
  }

  async function rename(chatId, title) {
    try {
      await renameChat(chatId, title);
      await loadAllChats();
    } catch (error) {
      console.error(error);
    }
  }

  async function remove(chatId) {
    try {
      await deleteChat(chatId);

      await loadAllChats();

      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    chats,
    activeChatId,
    setActiveChatId,
    newChat,
    openChat,
    saveChat,
    rename,
    remove,
    reloadChats: loadAllChats,
  };
}