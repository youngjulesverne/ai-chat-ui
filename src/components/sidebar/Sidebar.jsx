export default function Sidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat,
  }) {
    return (
      <aside className="w-72 border-r border-zinc-800 bg-zinc-950 p-4">
        <button
          className="w-full rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
          type="button"
          onClick={onNewChat}
        >
          + New Chat
        </button>
  
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Conversations
          </p>
  
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left ${
                conversation.id === activeConversationId
                  ? 'border-zinc-800 bg-zinc-900'
                  : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
              }`}
            >
              <div className="text-sm font-semibold">{conversation.title}</div>
              <div className="text-xs text-zinc-400">{conversation.subtitle}</div>
            </button>
          ))}
        </div>
      </aside>
    );
  }