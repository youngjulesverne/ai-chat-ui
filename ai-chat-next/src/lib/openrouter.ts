type Message = {
    role: "user" | "assistant" | "system";
    content: string;
  };
  
  export async function getAiReply(messages: Message[]) {
    const apiKey = process.env.OPENROUTER_API_KEY;
  
    console.log("OPENROUTER KEY EXISTS:", !!apiKey);
  
    if (!apiKey) {
      return "OPENROUTER_API_KEY is missing.";
    }
  
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ai-chat-next",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages,
      }),
    });
  
    const text = await response.text();
    console.log("OPENROUTER STATUS:", response.status);
    console.log("OPENROUTER RAW RESPONSE:", text);
  
    if (!response.ok) {
      return `OpenRouter error ${response.status}: ${text}`;
    }
  
    const data = JSON.parse(text);
    return data.choices?.[0]?.message?.content ?? "No response from assistant.";
  }