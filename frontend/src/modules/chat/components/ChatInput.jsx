import { useRef, useState } from "react";
import {
  Send,
  Square,
  X,
  Mic,
  MicOff,
} from "lucide-react";

import FileUploadButton from "./FileUploadButton";

export default function ChatInput({
  onSend,
  onStop,
  loading,
}) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) {
      return;
    }

    onSend({
      message,
      file: selectedFile,
    });

    setMessage("");
    setSelectedFile(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  return (
    <div className="border-t border-slate-800 bg-[#050816] p-5">
      {selectedFile && (
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
          "
        >
          <div>
            <p className="text-sm text-white">
              📎 {selectedFile.name}
            </p>

            <p className="text-xs text-gray-400">
              {selectedFile.type}
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="text-gray-400 hover:text-white"
            aria-label="Remove attached file"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
      >
        <FileUploadButton
          onSelect={setSelectedFile}
        />

        <textarea
          rows={1}
          value={message}
          placeholder={
            isListening
              ? "Listening..."
              : "Message Nyxora AI..."
          }
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="
            flex-1
            resize-none
            rounded-2xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
            text-white
            outline-none
            focus:border-violet-500
          "
        />

        <button
          type="button"
          onClick={handleVoiceInput}
          className={`
            rounded-xl
            p-3
            text-white
            transition
            ${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-slate-700 hover:bg-slate-600"
            }
          `}
          aria-label={
            isListening
              ? "Stop listening"
              : "Start voice input"
          }
          title={
            isListening
              ? "Stop listening"
              : "Voice input"
          }
        >
          {isListening ? (
            <MicOff size={18} />
          ) : (
            <Mic size={18} />
          )}
        </button>

        {loading ? (
          <button
            type="button"
            onClick={onStop}
            className="
              rounded-xl
              bg-red-500
              p-3
              text-white
            "
            aria-label="Stop generating"
          >
            <Square size={18} />
          </button>
        ) : (
          <button
            type="submit"
            className="
              rounded-xl
              bg-violet-600
              p-3
              text-white
            "
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        )}
      </form>
    </div>
  );
}