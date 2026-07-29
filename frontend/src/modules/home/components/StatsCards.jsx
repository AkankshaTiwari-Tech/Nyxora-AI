import {
  MessageSquare,
  FileText,
  Star,
  HardDrive,
} from "lucide-react";

const stats = [
  {
    title: "Chats",
    value: "12",
    icon: <MessageSquare size={26} />,
    color: "bg-blue-600",
  },
  {
    title: "Documents",
    value: "45",
    icon: <FileText size={26} />,
    color: "bg-green-600",
  },
  {
    title: "Favorites",
    value: "10",
    icon: <Star size={26} />,
    color: "bg-yellow-500",
  },
  {
    title: "Storage",
    value: "2.3 GB",
    icon: <HardDrive size={26} />,
    color: "bg-purple-600",
  },
];

export default function StatsCards() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-5">
        Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-[#151B2F] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${item.color}`}
            >
              {item.icon}
            </div>

            <h3 className="mt-5 text-gray-400">
              {item.title}
            </h3>

            <p className="text-3xl font-bold text-white mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}