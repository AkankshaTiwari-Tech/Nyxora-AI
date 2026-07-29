import {
  Home,
  MessageSquare,
  FolderOpen,
  FileText,
  FileDown,
  ClipboardList,
  Presentation,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import NyxoraLogo from "../common/NyxoraLogo";

const menuItems = [
  {
    name: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "AI Chat",
    icon: MessageSquare,
    path: "/chat",
  },
  {
    name: "Workspace",
    icon: FolderOpen,
    path: "/workspace",
  },
  {
    name: "Notes",
    icon: FileText,
    path: "/notes",
  },
  {
    name: "PDF Generator",
    icon: FileDown,
    path: "/pdf",
  },
  {
    name: "Test Generator",
    icon: ClipboardList,
    path: "/tests",
  },
  {
    name: "Presentation",
    icon: Presentation,
    path: "/presentation",
  },
  {
    name: "Favorites",
    icon: Star,
    path: "/favorites",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#0E1424] border-r border-[#20263B] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#20263B]">
        <div className="flex items-center gap-4">
          <NyxoraLogo size={52} />

          <div>
            <h1 className="text-2xl font-bold text-white">
              Nyxora AI
            </h1>

            <p className="text-sm text-indigo-300">
              Your AI Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-gray-400 hover:bg-[#1A2237] hover:text-white"
                  }`
                }
              >
                <Icon size={22} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#20263B]">
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}