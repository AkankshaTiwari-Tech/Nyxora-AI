import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({
  messages,
  onRegenerate,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            message={message.content}
            thinking={
              message.role === "assistant" &&
              message.content === ""
            }
            onRegenerate={() => onRegenerate?.(index)}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}