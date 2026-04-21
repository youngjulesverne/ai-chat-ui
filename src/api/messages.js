const messagesDb = {
  "conv-1": [
    {
      id: "m-1",
      role: "assistant",
      content: "Hey there! Just ask me a question. I am ready to answer.",
    },
    {
      id: "m-2",
      role: "user",
      content: "What is Kanye's best song?",
    },
    {
      id: "m-3",
      role: "assistant",
      content: "That depends on taste, but many people love Family Business.",
    },
  ],
  "conv-2": [
    {
      id: "m-4",
      role: "assistant",
      content: "Hi! What do you want help with today?",
    },
    {
      id: "m-5",
      role: "user",
      content: "Give me 3 productivity tips.",
    },
    {
      id: "m-6",
      role: "assistant",
      content:
        "Sure: time blocking, reducing distractions, and planning tomorrow the night before.",
    },
  ],
};

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMessagesByConversationId(conversationId) {
  await wait();
  return messagesDb[conversationId] ? [...messagesDb[conversationId]] : [];
}

export async function createMessage(conversationId, message) {
  await wait();

  if (!messagesDb[conversationId]) {
    messagesDb[conversationId] = [];
  }

  const newMessage = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: message.role,
    content: message.content,
  };

  messagesDb[conversationId].push(newMessage);
  return newMessage;
}
