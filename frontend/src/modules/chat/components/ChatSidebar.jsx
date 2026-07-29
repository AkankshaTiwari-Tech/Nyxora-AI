import { Plus, MessageSquare } from "lucide-react";

const chats = [
  {
    id: 1,
    title: "Machine Learning Notes",
  },
  {
    id: 2,
    title: "Math Test Generation",
  },
  {
    id: 3,
    title: "Python Interview",
  },
  {
    id: 4,
    title: "Resume Improvement",
  },
];

export default function ChatSidebar() {
  return (
    <aside className="w-80 bg-[#0E1424] border-r border-[#20263B] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#20263B]">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl transition">
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-[#151B2F] hover:bg-[#1B2340] transition"
          >
            <MessageSquare size={20} className="text-indigo-400" />

            <span className="text-gray-200 text-sm truncate">
              {chat.title}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}