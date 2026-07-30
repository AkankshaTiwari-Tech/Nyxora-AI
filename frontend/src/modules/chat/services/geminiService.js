export async function generateResponse(prompt, onChunk) {
  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect to AI server.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, {
      stream: true,
    });

    fullResponse += chunk;

    if (onChunk) {
      onChunk(fullResponse);
    }
  }

  return fullResponse;
}