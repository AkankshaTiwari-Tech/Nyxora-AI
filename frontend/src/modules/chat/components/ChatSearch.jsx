import { Search } from "lucide-react";

export default function ChatSearch({
  search,
  setSearch,
}) {
  return (
    <div className="relative mt-4">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        type="text"
        placeholder="Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#151B2F] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none border border-transparent focus:border-indigo-500"
      />
    </div>
  );
}