const conversationsDb = [
  {
    id: "conv-1",
    title: "Kanye West's best song",
    subtitle: "Active conversation",
  },
  {
    id: "conv-2",
    title: "Best productivity tips",
    subtitle: "Yesterday",
  },
];

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getConversations() {
  await wait();
  return [...conversationsDb];
}

export async function createConversation(title = "New Chat") {
  await wait();

  const newConversation = {
    id: `conv-${Date.now()}`,
    title,
    subtitle: "Just now",
  };

  conversationsDb.unshift(newConversation);
  return newConversation;
}
