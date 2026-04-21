"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Sidebar({
  initialConversations,
  activeConversationId,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const conversations = useMemo(() => {
    return queryClient.getQueryData(["conversations"]) ?? initialConversations;
  }, [initialConversations, queryClient]);

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/conversations", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      return response.json();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      const previousConversations =
        queryClient.getQueryData(["conversations"]) ?? initialConversations;

      const optimisticConversation = {
        id: `temp-${Date.now()}`,
        title: "New Chat",
        subtitle: "Open conversation",
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["conversations"], [
        optimisticConversation,
        ...previousConversations,
      ]);

      return { previousConversations };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["conversations"],
        context?.previousConversations ?? initialConversations,
      );
    },

    onSuccess: (createdConversation) => {
      startTransition(() => {
        router.push(`/conversations/${createdConversation.id}`);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      return id;
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      const previousConversations =
        queryClient.getQueryData(["conversations"]) ?? initialConversations;

      const nextConversations = previousConversations.filter(
        (conversation) => conversation.id !== id,
      );

      queryClient.setQueryData(["conversations"], nextConversations);

      return { previousConversations, nextConversations };
    },

    onError: (_error, _id, context) => {
      queryClient.setQueryData(
        ["conversations"],
        context?.previousConversations ?? initialConversations,
      );
    },

    onSuccess: async (deletedId) => {
      const currentConversations =
        queryClient.getQueryData(["conversations"]) ?? [];

      if (deletedId === activeConversationId) {
        if (currentConversations.length > 0) {
          startTransition(() => {
            router.push(`/conversations/${currentConversations[0].id}`);
          });
          return;
        }

        const response = await fetch("/api/conversations", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create fallback conversation");
        }

        const createdConversation = await response.json();

        startTransition(() => {
          router.push(`/conversations/${createdConversation.id}`);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <aside className="flex w-80 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <button
        onClick={() => createConversationMutation.mutate()}
        disabled={isPending || createConversationMutation.isPending}
        className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createConversationMutation.isPending ? "Working..." : "+ New Chat"}
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
                onClick={() => deleteConversationMutation.mutate(conversation.id)}
                disabled={isPending || deleteConversationMutation.isPending}
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