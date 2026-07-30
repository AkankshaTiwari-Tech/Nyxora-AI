import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

export default function ChatLayout({
  chats,
  activeChatId,
  messages,
 loading,
  onSend,
  onStop,
  onRegenerate,
  onNewChat,
  onOpenChat,
  onRenameChat,
  onDeleteChat,
}) {
  return (
    <div className="flex h-screen bg-slate-950">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={onNewChat}
        onSelectChat={onOpenChat}
        onRenameChat={onRenameChat}
        onDeleteChat={onDeleteChat}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow
          messages={messages}
          onRegenerate={onRegenerate}
        />

        <MessageInput
          loading={loading}
          onSend={onSend}
          onStop={onStop}
        />
      </div>
    </div>
  );
}