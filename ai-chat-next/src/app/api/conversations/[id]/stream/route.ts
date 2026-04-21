import { createOpenAI } from "@ai-sdk/openai";
import { type UIMessage, streamText } from "ai";
import { addMessage } from "../../../../../lib/data/chat";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function getTextFromMessage(message: UIMessage | undefined) {
  if (!message) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: conversationId } = await params;
    const body = await request.json();
    const messages: UIMessage[] = body.messages ?? [];

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    const userText = getTextFromMessage(lastUserMessage);

    if (!userText) {
      return new Response("User message is required.", { status: 400 });
    }

    await addMessage({
      conversationId,
      role: "user",
      content: userText,
    });

    const result = streamText({
      model: openrouter("openai/gpt-4.1-mini"),
      messages: messages.map((message) => ({
        role: message.role,
        content: message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(""),
      })),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: finishedMessages }) => {
        const lastAssistantMessage = [...finishedMessages]
          .reverse()
          .find((message) => message.role === "assistant");

        const assistantText = getTextFromMessage(lastAssistantMessage);

        if (assistantText) {
          await addMessage({
            conversationId,
            role: "assistant",
            content: assistantText,
          });
        }
      },
    });
  } catch (error) {
    console.error("STREAM ROUTE ERROR:", error);
    return new Response("Streaming failed", { status: 500 });
  }
}