import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}) {
  const handleRename = (chat) => {
    const title = prompt("Rename chat", chat.title);

    if (!title || title.trim() === "") return;

    onRenameChat(chat.id, title.trim());
  };

  const handleDelete = (chat) => {
    const confirmed = window.confirm(
      "Delete this chat?"
    );

    if (!confirmed) return;

    onDeleteChat(chat.id);
  };

  return (
    <div className="w-72 bg-[#0B1023] border-r border-gray-800 flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-400">
          Nyxora AI
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          AI Powered Workspace
        </p>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl py-3 font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {chats.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-sm">
            No chats yet
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`rounded-xl p-3 mb-3 cursor-pointer transition border ${
                activeChatId === chat.id
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-[#111827] border-transparent hover:bg-[#1F2937]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">

                <span className="truncate">
                  {chat.title || "New Chat"}
                </span>

                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleRename(chat)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(chat)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}