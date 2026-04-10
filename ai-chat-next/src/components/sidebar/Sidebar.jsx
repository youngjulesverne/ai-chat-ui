"use client";

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isCreating,
  isDeleting,
}) {
  return (
    <aside className="flex w-80 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <button
        onClick={onNewChat}
        disabled={isCreating}
        className="mb-4 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating ? "Creating..." : "+ New Chat"}
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
              onClick={() => onSelectConversation(conversation.id)}
              className="block w-full text-left"
            >
              <div className="truncate text-sm font-medium">{conversation.title}</div>
              <div className="truncate text-xs text-zinc-500">
                {conversation.subtitle || "Open conversation"}
              </div>
            </button>

            <button
              onClick={() => onDeleteConversation(conversation.id)}
              disabled={isDeleting}
              className="mt-2 text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}