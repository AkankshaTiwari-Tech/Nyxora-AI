const API_URL = "http://localhost:5000/api/chat";

export async function sendMessage(message) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to connect to AI.");
    }

    const data = await response.json();

    return data.reply;
  } catch (error) {
    console.error(error);
    throw error;
  }
}