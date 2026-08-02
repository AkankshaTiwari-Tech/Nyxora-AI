import { useEffect, useState } from "react";

import {
  createChat,
  getChats,
  saveMessages,
  updateChatTitle,
  deleteChat as deleteFirebaseChat,
  subscribeToChats,
  subscribeToMessages,
} from "../services/chatHistoryService";


const createWelcomeMessages = () => [
  {
    id: Date.now(),
    role: "assistant",
    message:
      "Hello 👋\n\nWelcome to Nyxora AI.\n\nHow can I help you today?",
  },
];


export default function useChatHistory() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // INITIAL CHAT LOAD
  // =====================================================

  useEffect(() => {
    async function initialize() {
      try {
        const savedChats =
          await getChats();

        if (savedChats.length > 0) {
          setChats(savedChats);

          setActiveChatId(
            savedChats[0].id
          );
        } else {
          const id =
            await createChat(
              "New Chat"
            );

          const newChat = {
            id,
            title: "New Chat",
            messages:
              createWelcomeMessages(),
          };

          setChats([newChat]);

          setActiveChatId(id);

          await saveMessages(
            id,
            newChat.messages
          );
        }
      } catch (error) {
        console.error(
          "Chat loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);


  // =====================================================
  // REALTIME CHAT LIST SYNC
  // =====================================================

  useEffect(() => {
    if (loading) return;

    let unsubscribe;

    try {
      unsubscribe =
        subscribeToChats(
          (realtimeChats) => {
            setChats((prev) => {
              return realtimeChats.map(
                (realtimeChat) => {
                  const existing =
                    prev.find(
                      (chat) =>
                        chat.id ===
                        realtimeChat.id
                    );

                  return {
                    ...realtimeChat,

                    messages:
                      existing?.messages ||
                      [],
                  };
                }
              );
            });
          }
        );
    } catch (error) {
      console.error(
        "Chat subscription error:",
        error
      );
    }

    return () => {
      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }
    };
  }, [loading]);


  // =====================================================
  // REALTIME ACTIVE CHAT MESSAGE SYNC
  // =====================================================

  useEffect(() => {
    if (!activeChatId) return;

    let unsubscribe;

    try {
      unsubscribe =
        subscribeToMessages(
          activeChatId,

          (messages) => {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id ===
                activeChatId
                  ? {
                      ...chat,
                      messages,
                    }
                  : chat
              )
            );
          }
        );
    } catch (error) {
      console.error(
        "Message subscription error:",
        error
      );
    }

    return () => {
      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }
    };
  }, [activeChatId]);


  const activeChat =
    chats.find(
      (chat) =>
        chat.id === activeChatId
    );


  // =====================================================
  // NEW CHAT
  // =====================================================

  const newChat = async () => {
    const id =
      await createChat(
        "New Chat"
      );

    const chat = {
      id,
      title: "New Chat",

      messages:
        createWelcomeMessages(),
    };

    setChats((prev) => [
      chat,
      ...prev,
    ]);

    setActiveChatId(id);

    await saveMessages(
      id,
      chat.messages
    );
  };


  // =====================================================
  // SELECT CHAT
  // =====================================================

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };


  // =====================================================
  // DELETE CHAT
  // =====================================================

  const deleteChat =
    async (chatId) => {
      if (chats.length === 1) {
        return;
      }

      await deleteFirebaseChat(
        chatId
      );

      setChats((prev) =>
        prev.filter(
          (chat) =>
            chat.id !== chatId
        )
      );

      if (
        activeChatId === chatId
      ) {
        const remaining =
          chats.filter(
            (chat) =>
              chat.id !== chatId
          );

        setActiveChatId(
          remaining[0]?.id || null
        );
      }
    };


  // =====================================================
  // RENAME CHAT
  // =====================================================

  const renameChat = async (
    chatId,
    title
  ) => {
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

    await updateChatTitle(
      chatId,
      title
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

    loading,
  };
}