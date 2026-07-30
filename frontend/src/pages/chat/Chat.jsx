import { useEffect, useRef } from "react";

import ChatLayout from "../../components/chat/ChatLayout";

import useChat from "../../hooks/useChat";
import useChatHistory from "../../hooks/useChatHistory";

export default function Chat() {
  const {
    messages,
    setMessages,
    loading,
    send,
    regenerate,
    stop,
  } = useChat();

  const {
    chats,
    activeChatId,
    setActiveChatId,
    newChat,
    openChat,
    saveChat,
    rename,
    remove,
    reloadChats,
  } = useChatHistory();

  const previousMessageCount = useRef(0);

  useEffect(() => {
    if (!activeChatId) return;

    saveChat(activeChatId, messages);

    const hasNewMessage =
      messages.length > previousMessageCount.current;

    if (hasNewMessage) {
      reloadChats();
    }

    previousMessageCount.current = messages.length;
  }, [messages, activeChatId]);

  const handleNewChat = async () => {
    const id = await newChat();

    if (!id) return;

    setActiveChatId(id);

    setMessages([
      {
        role: "assistant",
        content: "👋 Hello! I'm Nyxora AI.\nHow can I help you today?",
      },
    ]);
  };

  const handleOpenChat = async (chatId) => {
    const data = await openChat(chatId);
    setMessages(data);
  };

  return (
    <ChatLayout
      chats={chats}
      activeChatId={activeChatId}
      messages={messages}
      loading={loading}
      onSend={send}
      onStop={stop}
      onRegenerate={regenerate}
      onNewChat={handleNewChat}
      onOpenChat={handleOpenChat}
      onRenameChat={rename}
      onDeleteChat={remove}
    />
  );
}