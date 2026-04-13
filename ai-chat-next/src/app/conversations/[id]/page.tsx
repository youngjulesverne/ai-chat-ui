import { notFound } from "next/navigation";
import Sidebar from "../../../components/sidebar/Sidebar";
import ChatPanel from "../../../components/chat/ChatPanel";
import {
  getConversationById,
  listConversations,
  listMessages,
} from "../../../lib/data/chat";

function toUiMessages(messages: Awaited<ReturnType<typeof listMessages>>) {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
  }));
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: conversationId } = await params;

  const [conversation, conversations, messages] = await Promise.all([
    getConversationById(conversationId),
    listConversations(),
    listMessages(conversationId),
  ]);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        initialConversations={conversations}
        activeConversationId={conversationId}
      />

      <ChatPanel
        conversationId={conversationId}
        initialMessages={toUiMessages(messages)}
      />
    </div>
  );
}