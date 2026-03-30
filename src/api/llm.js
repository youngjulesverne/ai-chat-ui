const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

export async function getAiReply(messages) {
  console.log("KEY LOADED:", OPENROUTER_API_KEY);

  if (!OPENROUTER_API_KEY) {
    return "No API key found. Add VITE_OPENROUTER_API_KEY to your .env file.";
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-OpenRouter-Title": "AI Chat App",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  });

  const raw = await response.text();
  console.log("STATUS:", response.status);
  console.log("RAW:", raw);

  if (!response.ok) {
    return `OpenRouter error ${response.status}: ${raw}`;
  }

  const data = JSON.parse(raw);
  return data.choices?.[0]?.message?.content ?? "No response received.";
}
