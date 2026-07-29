import { Bot, Sparkles, MoreVertical } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="h-20 border-b border-[#20263B] bg-[#050816] flex items-center justify-between px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Bot className="text-white" size={24} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Nyxora AI Assistant
          </h2>

          <p className="text-sm text-green-400 flex items-center gap-2">
            <Sparkles size={14} />
            Online
          </p>
        </div>
      </div>

      {/* Right */}
      <button className="w-11 h-11 rounded-xl bg-[#151B2F] hover:bg-[#1B2340] transition flex items-center justify-center">
        <MoreVertical className="text-gray-300" size={20} />
      </button>
    </header>
  );
}