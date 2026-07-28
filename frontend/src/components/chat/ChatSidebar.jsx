export default function ChatSidebar() {
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
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-xl py-3 font-medium">
          + New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3">

        <div className="bg-[#111827] rounded-xl p-3 mb-3 cursor-pointer hover:bg-[#1F2937] transition">
          Chat 1
        </div>

        <div className="bg-[#111827] rounded-xl p-3 mb-3 cursor-pointer hover:bg-[#1F2937] transition">
          Chat 2
        </div>

        <div className="bg-[#111827] rounded-xl p-3 cursor-pointer hover:bg-[#1F2937] transition">
          Chat 3
        </div>

      </div>

    </div>
  );
}