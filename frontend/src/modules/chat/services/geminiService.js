export async function generateResponse(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to generate response");
    }

    return data.reply;
  } catch (error) {
    console.error("Frontend AI Error:", error);

    return "❌ Unable to connect to Nyxora AI backend.";
  }
}