import { MessageSquare, FolderOpen, Sparkles } from "lucide-react";

export default function Home() {
  const cards = [
    {
      title: "AI Chat",
      description: "Continue chatting with Gemini AI.",
      icon: <MessageSquare size={32} />,
      color: "bg-blue-100 text-blue-600",
      route: "/chat",
    },
    {
      title: "Workspace",
      description: "Manage Notes, PDFs, Tests & Documents.",
      icon: <FolderOpen size={32} />,
      color: "bg-green-100 text-green-600",
      route: "/workspace",
    },
    {
      title: "AI Tools",
      description: "Generate Notes, PDFs, Tests and more.",
      icon: <Sparkles size={32} />,
      color: "bg-purple-100 text-purple-600",
      route: "/tools",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Nyxora AI 🚀
        </h1>

        <p className="mt-2 text-gray-600 text-lg">
          Your Personal AI Workspace
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${card.color}`}
            >
              {card.icon}
            </div>

            <h2 className="mt-5 text-2xl font-semibold">{card.title}</h2>

            <p className="mt-2 text-gray-500">{card.description}</p>

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition">
              Open
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3 text-gray-600">
          <p>💬 No recent chats</p>
          <p>📄 No recent documents</p>
          <p>⭐ No favorites yet</p>
        </div>
      </div>
    </div>
  );
}