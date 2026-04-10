import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

export default async function Home() {
  const firstConversation = await prisma.conversation.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  if (firstConversation) {
    redirect(`/conversations/${firstConversation.id}`);
  }

  const newConversation = await prisma.conversation.create({
    data: {
      title: "New Chat",
      subtitle: "Open conversation",
    },
    select: { id: true },
  });

  redirect(`/conversations/${newConversation.id}`);
}