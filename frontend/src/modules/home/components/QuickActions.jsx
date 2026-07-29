import {
  MessageSquarePlus,
  FileText,
  FileDown,
  ClipboardList,
} from "lucide-react";

const actions = [
  {
    title: "New Chat",
    description: "Start a new AI conversation",
    icon: <MessageSquarePlus size={28} />,
  },
  {
    title: "Create Note",
    description: "Generate AI notes",
    icon: <FileText size={28} />,
  },
  {
    title: "Generate PDF",
    description: "Create downloadable PDF",
    icon: <FileDown size={28} />,
  },
  {
    title: "Create Test",
    description: "Generate exam papers",
    icon: <ClipboardList size={28} />,
  },
];

export default function QuickActions() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions.map((action) => (
          <button
            key={action.title}
            className="bg-[#151B2F] rounded-2xl p-6 text-left hover:bg-[#1B2340] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              {action.icon}
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              {action.title}
            </h3>

            <p className="mt-2 text-gray-400">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}