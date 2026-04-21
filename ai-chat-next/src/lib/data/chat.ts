import { prisma } from "../prisma";

export async function listConversations() {
  return prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      updatedAt: true,
    },
  });
}

export async function getConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      subtitle: true,
      updatedAt: true,
    },
  });
}

export async function createConversation() {
  return prisma.conversation.create({
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
}

export async function deleteConversation(id: string) {
  const existing = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  await prisma.conversation.delete({
    where: { id },
  });

  return true;
}

export async function listMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });
}

export async function addMessage(params: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const content = params.content.trim();

  const message = await prisma.message.create({
    data: {
      conversationId: params.conversationId,
      role: params.role,
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
    where: { id: params.conversationId },
    data: {
      subtitle: content.slice(0, 80),
      updatedAt: new Date(),
    },
  });

  return message;
}