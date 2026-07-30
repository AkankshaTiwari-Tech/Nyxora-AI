import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatItem({
  chat,
  activeChatId,
  editingId,
  setEditingId,
  title,
  setTitle,
  saveTitle,
  onSelectChat,
  onDeleteChat,
  showDelete,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId === chat.id && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId, chat.id]);

  return (
    <div
      className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
        activeChatId === chat.id
          ? "bg-indigo-600/20 border border-indigo-500"
          : "hover:bg-[#151B2F]"
      }`}
    >
      <div
        className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer"
        onClick={() => onSelectChat(chat.id)}
      >
        <MessageSquare
          size={18}
          className="text-indigo-400 flex-shrink-0"
        />

        {editingId === chat.id ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") setEditingId(null);
            }}
            className="bg-transparent outline-none text-sm text-white w-full"
          />
        ) : (
          <span className="truncate text-sm text-gray-200">
            {chat.title}
          </span>
        )}
      </div>

      <div
        className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setEditingId(chat.id);
            setTitle(chat.title);
          }}
          className="text-gray-500 hover:text-indigo-400 transition"
          title="Rename Chat"
        >
          <Pencil size={16} />
        </button>

        {showDelete && (
          <button
            onClick={() => onDeleteChat(chat.id)}
            className="text-gray-500 hover:text-red-500 transition"
            title="Delete Chat"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </div>
  );
}