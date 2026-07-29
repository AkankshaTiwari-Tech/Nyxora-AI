import {
  Bot,
  Sparkles,
  FileText,
  ClipboardList,
  FileDown,
} from "lucide-react";

const suggestions = [
  {
    title: "Generate Notes",
    description: "Create detailed notes on any topic.",
    icon: <FileText size={22} />,
  },
  {
    title: "Create Test",
    description: "Generate exam questions instantly.",
    icon: <ClipboardList size={22} />,
  },
  {
    title: "Generate PDF",
    description: "Convert AI responses into PDFs.",
    icon: <FileDown size={22} />,
  },
];

export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      {/* AI Avatar */}
      <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <Bot size={48} className="text-white" />
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-4xl font-bold text-white">
        Welcome to Nyxora AI
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-gray-400 max-w-xl">
        Your intelligent AI workspace for chatting, creating notes,
        generating PDFs, building tests, and much more.
      </p>

      {/* Badge */}
      <div className="mt-5 inline-flex items-center gap-2 bg-[#151B2F] px-4 py-2 rounded-full text-indigo-400">
        <Sparkles size={18} />
        AI Powered Workspace
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 w-full max-w-5xl">
        {suggestions.map((item) => (
          <button
            key={item.title}
            className="bg-[#151B2F] rounded-2xl p-6 text-left hover:bg-[#1B2340] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              {item.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-400 text-sm">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}