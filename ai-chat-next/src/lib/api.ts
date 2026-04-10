export type Conversation = {
    id: string;
    title: string;
    subtitle: string | null;
    updatedAt?: string;
  };
  
  export type Message = {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: string;
  };
  
  async function handleJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }
    return res.json();
  }
  
  export async function fetchConversations(): Promise<Conversation[]> {
    const res = await fetch("/api/conversations");
    return handleJson<Conversation[]>(res);
  }
  
  export async function createConversation(): Promise<Conversation> {
    const res = await fetch("/api/conversations", {
      method: "POST",
    });
    return handleJson<Conversation>(res);
  }
  
  export async function deleteConversation(id: string): Promise<void> {
    const res = await fetch(`/api/conversations/${id}`, {
      method: "DELETE",
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete conversation");
    }
  }
  
  export async function fetchMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`/api/conversations/${conversationId}/messages`);
    return handleJson<Message[]>(res);
  }
  
  export async function sendMessage(conversationId: string, content: string) {
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  
    return handleJson<{ userMessage: Message; assistantMessage: Message }>(res);
  }