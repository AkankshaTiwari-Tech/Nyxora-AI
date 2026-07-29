import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          {greeting} 👋
        </h1>

        <p className="mt-2 text-gray-400 text-lg">
          Welcome back to Nyxora AI Workspace
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="flex items-center bg-[#151B2F] rounded-xl px-4 py-3 w-80">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-3 bg-transparent outline-none w-full text-white placeholder-gray-500"
          />
        </div>

        <button className="relative bg-[#151B2F] p-3 rounded-xl hover:bg-[#202845] transition">
          <Bell className="text-white" size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          N
        </div>

      </div>
    </div>
  );
}