"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, isLoadingReply }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingReply]);

  if (!messages.length) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-semibold text-zinc-100">
            Start a conversation
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Send a message to begin chatting with the assistant.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 space-y-4 overflow-y-auto px-6 py-6" aria-label="Messages">
      {messages.map((message, index) => (
        <MessageBubble
          key={`${message.role}-${index}-${message.content}`}
          message={message}
        />
      ))}

      {isLoadingReply ? (
        <div className="max-w-[80%] rounded-2xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
          Assistant is typing...
        </div>
      ) : null}

      <div ref={bottomRef} />
    </section>
  );
}
