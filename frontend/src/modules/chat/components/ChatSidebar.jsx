import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import ChatSearch from "./ChatSearch";
import ChatGroup from "./ChatGroup";
import EmptyState from "./EmptyState";

import {
  groupChats,
  GROUP_ORDER,
} from "../utils/groupChats";

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [chats, search]);

  const groupedChats = useMemo(() => {
    return groupChats(filteredChats);
  }, [filteredChats]);

  const saveTitle = () => {
    if (!editingId) return;

    onRenameChat(
      editingId,
      title.trim() || "New Chat"
    );

    setEditingId(null);
  };

  return (
    <aside className="w-80 h-screen bg-[#0B1020] border-r border-[#1F2937] flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1F2937]">
        <h1 className="text-2xl font-bold text-white">
          Nyxora <span className="text-indigo-500">AI</span>
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Your Intelligent Workspace
        </p>
      </div>

      {/* New Chat */}
      <div className="p-5">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white py-3 font-medium"
        >
          <Plus size={20} />
          New Chat
        </button>

        <ChatSearch
          search={search}
          setSearch={setSearch}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {filteredChats.length === 0 ? (
          <EmptyState />
        ) : (
          GROUP_ORDER.map((group) => (
            <ChatGroup
              key={group}
              title={group}
              chats={groupedChats[group] || []}
              activeChatId={activeChatId}
              editingId={editingId}
              setEditingId={setEditingId}
              inputTitle={title}
              setInputTitle={setTitle}
              saveTitle={saveTitle}
              onSelectChat={onSelectChat}
              onDeleteChat={onDeleteChat}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1F2937] p-4">
        <div className="rounded-xl bg-[#151B2F] p-3">
          <p className="text-white text-sm font-medium">
            Nyxora AI v1.0
          </p>

          <p className="text-gray-400 text-xs mt-1">
            Built by ❤️ Team Nyxora
          </p>
        </div>
      </div>
    </aside>
  );
}