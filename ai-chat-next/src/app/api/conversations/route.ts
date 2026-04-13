import { prisma } from "../../../lib/prisma";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      updatedAt: true,
    },
  });

  return Response.json(conversations);
}

export async function POST() {
  const conversation = await prisma.conversation.create({
    data: {
      title: "New Chat",
      subtitle: "Open conversation",
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      updatedAt: true,
    },
  });

  return Response.json(conversation, { status: 201 });
}