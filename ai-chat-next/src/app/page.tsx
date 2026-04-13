import { redirect } from "next/navigation";
import { createConversation, listConversations } from "../lib/data/chat";

export default async function Home() {
  const conversations = await listConversations();

  if (conversations.length > 0) {
    redirect(`/conversations/${conversations[0].id}`);
  }

  const newConversation = await createConversation();
  redirect(`/conversations/${newConversation.id}`);
}