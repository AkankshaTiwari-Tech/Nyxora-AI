// ======================================================
// IMPORTS
// ======================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

import useChatHistory from "../hooks/useChatHistory";
import useChat from "../hooks/useChat";


// ======================================================
// CHAT PAGE
// ======================================================

export default function Chat() {

  // ====================================================
  // ASSISTANT MODE
  // ====================================================

  const [
    selectedMode,
    setSelectedMode,
  ] = useState("normal");


  // ====================================================
  // CHAT HISTORY
  // ====================================================

  const {
    chats,
    setChats,
    activeChat,
    activeChatId,
    newChat,
    selectChat,
    deleteChat,
    renameChat,
  } = useChatHistory();


  // ====================================================
  // CHAT AI
  // ====================================================

  const {
    send,
    regenerate,
    editMessage,
    stop,
    isThinking,
  } = useChat({
    activeChatId,
    chats,
    setChats,
    selectedMode,
  });


  const bottomRef =
    useRef(null);


  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    activeChat?.messages,
    isThinking,
  ]);


  // ====================================================
  // CHAT HANDLERS
  // ====================================================

  const handleNewChat = () => {
    newChat();
  };


  const handleSelectChat = (
    chatId
  ) => {
    selectChat(chatId);
  };


  const handleDeleteChat = (
    chatId
  ) => {
    deleteChat(chatId);
  };


  const handleRenameChat = (
    chatId,
    title
  ) => {
    renameChat(
      chatId,
      title
    );
  };


  const handleRegenerate = () => {
    regenerate();
  };


  const handleEdit = (
    messageId,
    newText
  ) => {
    editMessage(
      messageId,
      newText
    );
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="flex h-screen bg-[#050816]">

      <ChatSidebar
        chats={chats}
        activeChatId={
          activeChatId
        }
        onNewChat={
          handleNewChat
        }
        onSelectChat={
          handleSelectChat
        }
        onDeleteChat={
          handleDeleteChat
        }
        onRenameChat={
          handleRenameChat
        }
      />


      <div className="flex flex-col flex-1">

        <ChatHeader
          selectedMode={
            selectedMode
          }
          onModeChange={
            setSelectedMode
          }
        />


        <div className="flex-1 overflow-y-auto px-8 py-8">

          {activeChat?.messages.map(
            (msg) => (

              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={
                  handleRegenerate
                }
                onEdit={
                  handleEdit
                }
              />

            )
          )}


          {isThinking && (

            <ChatMessage
              message={{
                id: "thinking",
                role: "assistant",
                message: "",
              }}
              thinking
            />

          )}


          <div ref={bottomRef} />

        </div>


        <ChatInput
          onSend={send}
          onStop={stop}
          loading={isThinking}
        />

      </div>

    </div>

  );
}