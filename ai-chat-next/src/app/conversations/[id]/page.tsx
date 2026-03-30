"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar/Sidebar";
import ChatPanel from "../../../components/chat/ChatPanel";

type Conversation = {
  id: string;
  title: string;
  subtitle: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = String(params.id ?? "");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data);
    }
    loadConversations();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!conversationId) return;
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
    }
    loadMessages();
  }, [conversationId]);

  async function handleNewChat() {
    const res = await fetch("/api/conversations", { method: "POST" });
    if (!res.ok) return;
    const newConversation = await res.json();
    router.push(`/conversations/${newConversation.id}`);
  }

  async function handleSendMessage(text: string) {
    if (!conversationId) return;

    const optimisticUserMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setIsLoadingReply(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      const data = await res.json();

      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong while fetching the AI response.",
        },
      ]);
    } finally {
      setIsLoadingReply(false);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={(id) => router.push(`/conversations/${id}`)}
        onNewChat={handleNewChat}
      />
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoadingReply={isLoadingReply}
      />
    </div>
  );
}
