"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({
  initialConversations,
  activeConversationId,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [conversations, setConversations] = useState(initialConversations);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  async function handleNewChat() {
    const previous = conversations;

    const optimisticConversation = {
      id: `temp-${Date.now()}`,
      title: "New Chat",
      subtitle: "Open conversation",
      updatedAt: new Date().toISOString(),
    };

    setConversations([optimisticConversation, ...previous]);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const createdConversation = await response.json();

      startTransition(() => {
        router.push(`/conversations/${createdConversation.id}`);
        router.refresh();
      });
    } catch (error) {
      setConversations(previous);
      console.error(error);
    }
  }

  async function handleDeleteConversation(id) {
    const previous = conversations;
    const nextConversations = previous.filter((conversation) => conversation.id !== id);

    setConversations(nextConversations);

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      if (id === activeConversationId) {
        if (nextConversations.length > 0) {
          startTransition(() => {
            router.push(`/conversations/${nextConversations[0].id}`);
            router.refresh();
          });
        } else {
          const createResponse = await fetch("/api/conversations", {
            method: "POST",
          });

          if (!createResponse.ok) {
            throw new Error("Failed to create fallback conversation");
          }

          const createdConversation = await createResponse.json();

          startTransition(() => {
            router.push(`/conversations/${createdConversation.id}`);
            router.refresh();
          });
        }
      } else {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      setConversations(previous);
      console.error(error);
    }
  }

  return (
    <aside className="flex w-80 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <button
        onClick={handleNewChat}
        disabled={isPending}
        className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Working..." : "+ New Chat"}
      </button>

      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Conversations
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`rounded-xl border p-2 transition ${
              conversation.id === activeConversationId
                ? "border-zinc-700 bg-zinc-900"
                : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
            }`}
          >
            <button
              onClick={() => router.push(`/conversations/${conversation.id}`)}
              className="block w-full text-left"
            >
              <div className="truncate text-sm font-medium">{conversation.title}</div>
              <div className="truncate text-xs text-zinc-500">
                {conversation.subtitle || "Open conversation"}
              </div>
            </button>

            {!String(conversation.id).startsWith("temp-") ? (
              <button
                onClick={() => handleDeleteConversation(conversation.id)}
                disabled={isPending}
                className="mt-2 text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
              >
                Delete
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}