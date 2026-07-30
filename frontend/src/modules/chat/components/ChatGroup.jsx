import ChatItem from "./ChatItem";

export default function ChatGroup({
  title,
  chats,
  activeChatId,
  editingId,
  setEditingId,
  inputTitle,
  setInputTitle,
  saveTitle,
  onSelectChat,
  onDeleteChat,
}) {
  if (!chats || chats.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 px-2">
        {title}
      </h2>

      <div className="space-y-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            activeChatId={activeChatId}
            editingId={editingId}
            setEditingId={setEditingId}
            title={inputTitle}
            setTitle={setInputTitle}
            saveTitle={saveTitle}
            onSelectChat={onSelectChat}
            onDeleteChat={onDeleteChat}
            showDelete={chats.length > 1}
          />
        ))}
      </div>
    </div>
  );
}