"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../components/sidebar/Sidebar";
import ChatPanel from "../../../components/chat/ChatPanel";
import {
  createConversation,
  deleteConversation,
  fetchConversations,
  fetchMessages,
  sendMessage,
  type Message,
} from "../../../lib/api";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const conversationId = String(params.id ?? "");

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: Boolean(conversationId),
  });

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: async (newConversation) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/conversations/${newConversation.id}`);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessage(conversationId, content),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] }),
        queryClient.invalidateQueries({ queryKey: ["conversations"] }),
      ]);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: async (_, deletedId) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });

      if (deletedId === conversationId) {
        const updated = await queryClient.fetchQuery({
          queryKey: ["conversations"],
          queryFn: fetchConversations,
        });

        if (updated.length > 0) {
          router.push(`/conversations/${updated[0].id}`);
        } else {
          const newConversation = await createConversationMutation.mutateAsync();
          router.push(`/conversations/${newConversation.id}`);
        }
      }
    },
  });

  const optimisticMessages = useMemo(() => {
    const base = messagesQuery.data ?? [];
    if (!sendMessageMutation.isPending || !sendMessageMutation.variables) {
      return base;
    }

    const optimisticUserMessage: Message = {
      id: "optimistic-user",
      role: "user",
      content: sendMessageMutation.variables,
    };

    return [...base, optimisticUserMessage];
  }, [messagesQuery.data, sendMessageMutation.isPending, sendMessageMutation.variables]);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        conversations={conversationsQuery.data ?? []}
        activeConversationId={conversationId}
        onSelectConversation={(id: string) => router.push(`/conversations/${id}`)}
        onNewChat={() => createConversationMutation.mutate()}
        onDeleteConversation={(id: string) => deleteConversationMutation.mutate(id)}
        isCreating={createConversationMutation.isPending}
        isDeleting={deleteConversationMutation.isPending}
      />

      <ChatPanel
        messages={optimisticMessages}
        onSendMessage={async (text: string) => {
          await sendMessageMutation.mutateAsync(text);
        }}
        isLoadingReply={sendMessageMutation.isPending}
      />
    </div>
  );
}