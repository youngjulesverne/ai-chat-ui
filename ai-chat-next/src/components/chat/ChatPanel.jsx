"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoadingReply,
}) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <h1 className="text-sm font-semibold">AI Chat</h1>
        <p className="text-xs text-zinc-400">Next.js version</p>
      </header>

      <MessageList messages={messages} isLoadingReply={isLoadingReply} />
      <MessageInput onSendMessage={onSendMessage} disabled={isLoadingReply} />
    </main>
  );
}
