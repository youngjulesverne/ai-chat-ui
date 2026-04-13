import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, type UIMessage, streamText } from "ai";
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

    console.log("STREAM HIT");
    console.log("conversationId:", conversationId);
    console.log("messages length:", messages.length);

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    const userText = getTextFromMessage(lastUserMessage);
    console.log("userText:", userText);

    if (!userText) {
      console.log("No user text found");
      return new Response("User message is required.", { status: 400 });
    }

    await addMessage({
      conversationId,
      role: "user",
      content: userText,
    });

    console.log("Saved user message");

    const result = streamText({
      model: openrouter("nvidia/nemotron-3-super-120b-a12b:free"),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(""),
      })),
    });

    console.log("streamText started");

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: finishedMessages }) => {
        console.log("onFinish called");

        const lastAssistantMessage = [...finishedMessages]
          .reverse()
          .find((message) => message.role === "assistant");

        const assistantText = getTextFromMessage(lastAssistantMessage);
        console.log("assistantText:", assistantText);

        if (assistantText) {
          await addMessage({
            conversationId,
            role: "assistant",
            content: assistantText,
          });
          console.log("Saved assistant message");
        } else {
          console.log("No assistant text to save");
        }
      },
    });
  } catch (error) {
    console.error("STREAM ROUTE ERROR:", error);
    return new Response("Streaming failed", { status: 500 });
  }
}