type Conversation = {
  id: string;
  title: string;
  subtitle: string;
};

const globalForConversations = globalThis as typeof globalThis & {
  conversationsStore?: Conversation[];
};

const conversations =
  globalForConversations.conversationsStore ??
  (globalForConversations.conversationsStore = [
    { id: "1", title: "First Chat", subtitle: "Welcome" },
  ]);

export async function GET() {
  return Response.json(conversations);
}

export async function POST() {
  const newConversation: Conversation = {
    id: Date.now().toString(),
    title: "New Chat",
    subtitle: "",
  };

  conversations.unshift(newConversation);
  return Response.json(newConversation);
}
