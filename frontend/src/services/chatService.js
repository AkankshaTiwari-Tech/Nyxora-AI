const API_URL = "http://localhost:5000/api/chat";

let controller = null;

export async function sendMessage(
  message,
  onChunk,
  signal = null
) {
  controller = new AbortController();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
    signal: signal || controller.signal,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to connect to Nyxora AI."
    );
  }

  if (!response.body) {
    throw new Error("Streaming is not supported.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true,
      });

      fullText += chunk;

      if (onChunk) {
        onChunk(fullText);
      }
    }

    return fullText;
  } finally {
    controller = null;
  }
}

export function stopGeneration() {
  if (controller) {
    controller.abort();
    controller = null;
  }
}