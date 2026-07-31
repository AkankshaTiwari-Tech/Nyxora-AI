import { Bot, User } from "lucide-react";

export default function MessageAvatar({
  role,
}) {
  if (role === "assistant") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600">
        <Bot
          size={20}
          className="text-white"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700">
      <User
        size={20}
        className="text-white"
      />
    </div>
  );
}