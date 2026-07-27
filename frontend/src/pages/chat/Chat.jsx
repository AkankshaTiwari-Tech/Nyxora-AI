import { useState } from "react";
import { sendMessage } from "../../services/chatService";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const aiReply = await sendMessage(message);
      setReply(aiReply);
    } catch (error) {
      setReply("❌ Failed to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>🤖 Nyxora AI Chat</h1>

      <textarea
        rows="5"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f4f4f4",
          borderRadius: "10px",
          minHeight: "120px",
        }}
      >
        <strong>AI Reply:</strong>

        <p>{reply}</p>
      </div>
    </div>
  );
}