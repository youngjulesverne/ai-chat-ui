"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPanel({ conversationId, initialMessages }) {
  const router = useRouter();

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `/api/conversations/${conversationId}/stream`,
    }),
    onFinish: () => {
      router.refresh();
    },
  });

  return (
    <main className="flex flex-1 flex-col bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <h1 className="text-sm font-semibold">AI Chat</h1>
        <p className="text-xs text-zinc-400">Next.js version</p>
      </header>

      <MessageList
        messages={messages}
        isLoadingReply={status === "submitted" || status === "streaming"}
      />

      <MessageInput
        onSendMessage={async (text) => {
          await sendMessage({ text });
        }}
        disabled={status === "submitted" || status === "streaming"}
      />
    </main>
  );
}