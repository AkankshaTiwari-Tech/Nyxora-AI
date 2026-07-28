export default function ChatHeader() {
  return (
    <div className="h-16 border-b border-gray-800 bg-[#050816] flex items-center justify-between px-6">

      <div>
        <h2 className="text-xl font-semibold text-white">
          Nyxora AI
        </h2>

        <p className="text-sm text-gray-400">
          Your AI Assistant
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
          N
        </div>

      </div>

    </div>
  );
}