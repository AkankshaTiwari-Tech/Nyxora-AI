import {
  Bot,
  FileText,
  FileDown,
  ClipboardList,
  Presentation,
  FileSpreadsheet,
} from "lucide-react";

const tools = [
  {
    title: "AI Chat",
    icon: <Bot size={28} />,
    color: "bg-indigo-600",
  },
  {
    title: "Notes Generator",
    icon: <FileText size={28} />,
    color: "bg-green-600",
  },
  {
    title: "PDF Generator",
    icon: <FileDown size={28} />,
    color: "bg-red-600",
  },
  {
    title: "Test Generator",
    icon: <ClipboardList size={28} />,
    color: "bg-yellow-500",
  },
  {
    title: "Presentation",
    icon: <Presentation size={28} />,
    color: "bg-pink-600",
  },
  {
    title: "Spreadsheet",
    icon: <FileSpreadsheet size={28} />,
    color: "bg-cyan-600",
  },
];

export default function AITools() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-5">
        AI Tools
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {tools.map((tool) => (
          <button
            key={tool.title}
            className="bg-[#151B2F] rounded-2xl p-5 hover:bg-[#1B2340] transition-all duration-300 hover:scale-105"
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${tool.color}`}
            >
              {tool.icon}
            </div>

            <h3 className="mt-4 text-white font-semibold text-sm">
              {tool.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}