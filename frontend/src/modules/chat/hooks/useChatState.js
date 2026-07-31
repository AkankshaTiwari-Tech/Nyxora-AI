import { useState } from "react";

export default function useChatState() {
  const [isThinking, setIsThinking] = useState(false);

  return {
    isThinking,
    setIsThinking,
  };
}