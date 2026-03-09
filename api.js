const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemma-3-27b-it:free";

export async function streamChatCompletion(messages, onDelta) {
  const apiKey = window.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Readable stream not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullReply = "";
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line.startsWith("data:")) {
        continue;
      }

      const jsonText = line.replace(/^data:\s*/, "");

      if (jsonText === "[DONE]") {
        return fullReply;
      }

      try {
        const parsed = JSON.parse(jsonText);
        const delta = parsed.choices?.[0]?.delta?.content;

        if (delta) {
          fullReply += delta;
          onDelta(fullReply, delta);
        }
      } catch (error) {
        console.error("Failed to parse stream chunk:", error);
      }
    }
  }

  return fullReply;
}
