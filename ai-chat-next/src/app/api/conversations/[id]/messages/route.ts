import { getAiReply } from "../../../../../lib/openrouter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const globalForMessages = globalThis as typeof globalThis & {
  messagesStore?: Record<string, Message[]>;
};

const messagesDb =
  globalForMessages.messagesStore ??
  (globalForMessages.messagesStore = {
    "1": [],
  });

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return Response.json(messagesDb[id] || []);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();

  const userMessage: Message = {
    role: "user",
    content: body.content,
  };

  if (!messagesDb[id]) {
    messagesDb[id] = [];
  }

  messagesDb[id].push(userMessage);

  try {
    const aiText = await getAiReply(messagesDb[id]);

    const assistantMessage: Message = {
      role: "assistant",
      content: aiText,
    };

    messagesDb[id].push(assistantMessage);

    return Response.json({ assistantMessage });
  } catch {
    const assistantMessage: Message = {
      role: "assistant",
      content: "Sorry, something went wrong while fetching the AI response.",
    };

    messagesDb[id].push(assistantMessage);

    return Response.json({ assistantMessage }, { status: 500 });
  }
}
