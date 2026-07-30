import { useState } from "react";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

export default function MessageActions({
  message,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = () => {
    setLiked(!liked);

    if (disliked) {
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    setDisliked(!disliked);

    if (liked) {
      setLiked(false);
    }
  };

  return (
    <div className="mt-5 flex items-center gap-4 border-t border-slate-700 pt-4 text-gray-400">
      <button
        onClick={copyMessage}
        className="transition hover:text-white"
        title="Copy"
      >
        {copied ? (
          <Check size={18} className="text-green-400" />
        ) : (
          <Copy size={18} />
        )}
      </button>

      <button
        onClick={handleLike}
        className={`transition ${
          liked
            ? "text-green-400"
            : "hover:text-green-400"
        }`}
        title="Like"
      >
        <ThumbsUp size={18} />
      </button>

      <button
        onClick={handleDislike}
        className={`transition ${
          disliked
            ? "text-red-400"
            : "hover:text-red-400"
        }`}
        title="Dislike"
      >
        <ThumbsDown size={18} />
      </button>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="transition hover:text-indigo-400"
          title="Regenerate Response"
        >
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}