import {
  useEffect,
  useState,
} from "react";

import {
  createChat,
  getChats,
  saveMessages,
  updateChatTitle,
  deleteChat as deleteFirebaseChat,
  clearChatMessages,
  subscribeToChats,
  subscribeToMessages,
} from "../services/chatHistoryService";


// ======================================================
// WELCOME MESSAGE
// ======================================================

const createWelcomeMessages = () => [
  {
    id: Date.now(),
    role: "assistant",
    message:
      "Hello 👋\n\nWelcome to Nyxora AI.\n\nHow can I help you today?",
  },
];


// ======================================================
// CHAT HISTORY HOOK
// ======================================================

export default function useChatHistory() {

  const [
    chats,
    setChats,
  ] = useState([]);


  const [
    activeChatId,
    setActiveChatId,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ====================================================
  // INITIAL CHAT LOAD
  // ====================================================

  useEffect(() => {

    async function initialize() {

      try {

        const savedChats =
          await getChats();


        if (
          savedChats.length > 0
        ) {

          setChats(
            savedChats
          );


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

            title:
              "New Chat",

            messages:
              createWelcomeMessages(),

          };


          setChats([
            newChat,
          ]);


          setActiveChatId(
            id
          );


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

        setLoading(
          false
        );

      }

    }


    initialize();

  }, []);


  // ====================================================
  // REALTIME CHAT LIST SYNC
  // ====================================================

  useEffect(() => {

    if (loading) {

      return;

    }


    let unsubscribe;


    try {

      unsubscribe =
        subscribeToChats(

          (realtimeChats) => {

            setChats(
              (prev) =>

                realtimeChats.map(
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
                )
            );

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


  // ====================================================
  // REALTIME ACTIVE CHAT MESSAGE SYNC
  // ====================================================

  useEffect(() => {

    if (
      !activeChatId
    ) {

      return;

    }


    let unsubscribe;


    try {

      unsubscribe =
        subscribeToMessages(

          activeChatId,

          (messages) => {

            setChats(
              (prev) =>

                prev.map(
                  (chat) =>

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


  // ====================================================
  // ACTIVE CHAT
  // ====================================================

  const activeChat =
    chats.find(
      (chat) =>
        chat.id ===
        activeChatId
    );


  // ====================================================
  // NEW CHAT
  // ====================================================

  const newChat =
    async () => {

      try {

        const id =
          await createChat(
            "New Chat"
          );


        const chat = {

          id,

          title:
            "New Chat",

          messages:
            createWelcomeMessages(),

        };


        setChats(
          (prev) => [
            chat,
            ...prev,
          ]
        );


        setActiveChatId(
          id
        );


        await saveMessages(
          id,
          chat.messages
        );


        return true;

      } catch (error) {

        console.error(
          "Create chat error:",
          error
        );


        return false;

      }

    };


  // ====================================================
  // SELECT CHAT
  // ====================================================

  const selectChat = (
    chatId
  ) => {

    setActiveChatId(
      chatId
    );

  };


  // ====================================================
  // DELETE CHAT
  //
  // Firestore is deleted FIRST.
  //
  // Local state changes only after Firebase confirms
  // that deletion succeeded.
  // ====================================================

  const deleteChat =
    async (
      chatId
    ) => {

      if (
        !chatId
      ) {

        return false;

      }


      // Nyxora always keeps at least
      // one conversation available.

      if (
        chats.length === 1
      ) {

        console.warn(
          "Cannot delete the only remaining chat."
        );


        return false;

      }


      try {

        // ----------------------------------------------
        // Determine the next active chat BEFORE changing
        // local state.
        // ----------------------------------------------

        const remainingChats =
          chats.filter(
            (chat) =>
              chat.id !==
              chatId
          );


        const deletingActiveChat =
          activeChatId ===
          chatId;


        const nextActiveChatId =
          deletingActiveChat

            ? (
                remainingChats[0]?.id ||
                null
              )

            : activeChatId;


        // ----------------------------------------------
        // DELETE FROM FIRESTORE FIRST
        // ----------------------------------------------

        await deleteFirebaseChat(
          chatId
        );


        // ----------------------------------------------
        // FIRESTORE SUCCEEDED
        // NOW UPDATE LOCAL STATE
        // ----------------------------------------------

        setChats(
          (prev) =>

            prev.filter(
              (chat) =>
                chat.id !==
                chatId
            )
        );


        // ----------------------------------------------
        // SWITCH ACTIVE CHAT IF REQUIRED
        // ----------------------------------------------

        if (
          deletingActiveChat
        ) {

          setActiveChatId(
            nextActiveChatId
          );

        }


        console.log(
          "🗑️ Chat deleted successfully:",
          chatId
        );


        return true;

      } catch (error) {

        // ----------------------------------------------
        // IMPORTANT:
        // Local chat state is NOT removed when Firebase
        // deletion fails.
        // ----------------------------------------------

        console.error(
          "Delete chat error:",
          error
        );


        return false;

      }

    };


  // ====================================================
  // CLEAR CONVERSATION
  // ====================================================

  const clearConversation =
    async (
      chatId
    ) => {

      if (
        !chatId
      ) {

        return false;

      }


      try {

        // ----------------------------------------------
        // CLEAR STORED MESSAGES
        // ----------------------------------------------

        await clearChatMessages(
          chatId
        );


        // ----------------------------------------------
        // CREATE FRESH WELCOME MESSAGE
        // ----------------------------------------------

        const welcomeMessages =
          createWelcomeMessages();


        // ----------------------------------------------
        // UPDATE LOCAL STATE
        // ----------------------------------------------

        setChats(
          (prev) =>

            prev.map(
              (chat) =>

                chat.id ===
                chatId

                  ? {
                      ...chat,

                      messages:
                        welcomeMessages,
                    }

                  : chat
            )
        );


        // ----------------------------------------------
        // PERSIST WELCOME MESSAGE
        // ----------------------------------------------

        await saveMessages(
          chatId,
          welcomeMessages
        );


        console.log(
          "🧹 Conversation cleared successfully:",
          chatId
        );


        return true;

      } catch (error) {

        console.error(
          "Clear conversation error:",
          error
        );


        return false;

      }

    };


  // ====================================================
  // RENAME CHAT
  // ====================================================

  const renameChat =
    async (
      chatId,
      title
    ) => {

      if (
        !chatId ||
        !String(title).trim()
      ) {

        return false;

      }


      const cleanTitle =
        String(
          title
        ).trim();


      try {

        // ----------------------------------------------
        // UPDATE FIRESTORE FIRST
        // ----------------------------------------------

        await updateChatTitle(
          chatId,
          cleanTitle
        );


        // ----------------------------------------------
        // THEN UPDATE LOCAL STATE
        // ----------------------------------------------

        setChats(
          (prev) =>

            prev.map(
              (chat) =>

                chat.id ===
                chatId

                  ? {
                      ...chat,
                      title:
                        cleanTitle,
                    }

                  : chat
            )
        );


        return true;

      } catch (error) {

        console.error(
          "Rename chat error:",
          error
        );


        return false;

      }

    };


  // ====================================================
  // RETURN
  // ====================================================

  return {

    chats,

    setChats,

    activeChat,

    activeChatId,

    setActiveChatId,

    newChat,

    selectChat,

    deleteChat,

    clearConversation,

    renameChat,

    loading,

  };

}