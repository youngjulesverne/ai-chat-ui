import { prisma } from "../../../../../lib/prisma";
import { getAiReply } from "../../../../../lib/openrouter";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  return Response.json(conversation.messages);
}

export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const content = String(body.content ?? "").trim();

  if (!content) {
    return Response.json({ error: "Message content is required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          role: true,
          content: true,
        },
      },
    },
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const userMessage = await prisma.message.create({
    data: {
      conversationId: id,
      role: "user",
      content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: {
      title:
        conversation.title === "New Chat"
          ? content.slice(0, 30)
          : conversation.title,
      subtitle: content.slice(0, 60),
    },
  });

  try {
    const aiText = await getAiReply([
      ...conversation.messages,
      { role: "user", content },
    ]);

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: id,
        role: "assistant",
        content: aiText,
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    await prisma.conversation.update({
      where: { id },
      data: {
        subtitle: aiText.slice(0, 60),
      },
    });

    return Response.json({ userMessage, assistantMessage }, { status: 201 });
  } catch {
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: id,
        role: "assistant",
        content: "Sorry, something went wrong while fetching the AI response.",
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return Response.json({ userMessage, assistantMessage }, { status: 500 });
  }
}