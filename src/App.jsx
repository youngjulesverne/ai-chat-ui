import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar.jsx';
import ChatPanel from './components/chat/ChatPanel.jsx';
import { createConversation, getConversations } from './api/conversations.js';
import {
  createMessage,
  getMessagesByConversationId,
} from './api/messages.js';
import { getAiReply } from './api/llm.js';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      const data = await getConversations();
      setConversations(data);

      if (data.length > 0) {
        setActiveConversationId(data[0].id);
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!activeConversationId) return;

      const data = await getMessagesByConversationId(activeConversationId);
      setMessages(data);
    }

    loadMessages();
  }, [activeConversationId]);

  async function handleNewChat() {
    const newConversation = await createConversation('New Chat');
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
  }

  async function handleSendMessage(text) {
    if (!activeConversationId) return;

    const userMessage = await createMessage(activeConversationId, {
      role: 'user',
      content: text,
    });

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoadingReply(true);

    try {
      const aiText = await getAiReply(updatedMessages);

      const assistantMessage = await createMessage(activeConversationId, {
        role: 'assistant',
        content: aiText,
      });

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = await createMessage(activeConversationId, {
        role: 'assistant',
        content: 'Sorry, something went wrong while fetching the AI response.',
      });

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingReply(false);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
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