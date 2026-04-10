import { useState } from 'react';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
          isUser ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-100'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function MessageInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    await onSendMessage(trimmed);
    setInput('');
  }

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 p-4">
      <form
        className="mx-auto flex max-w-3xl items-end gap-3"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="messageInput">
          Message
        </label>

        <textarea
        id="messageInput"
        rows="1"
        placeholder="Type a message..."
        className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form.requestSubmit();
        }
  }}
  disabled={disabled}
/>

        <button
          type="submit"
          className="h-[44px] rounded-2xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-60"
          disabled={disabled}
        >
          Send
        </button>
      </form>
    </footer>
  );
}

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoadingReply,
}) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <h1 className="text-sm font-semibold">AI Chat</h1>
        <p className="text-xs text-zinc-400">React + Vite version</p>
      </header>

      <section
        className="flex-1 space-y-4 overflow-y-auto px-6 py-6"
        aria-label="Messages"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </section>

      {isLoadingReply && (
        <div className="px-6 pb-2 text-sm text-zinc-400">AI is typing...</div>
      )}

      <MessageInput
        onSendMessage={onSendMessage}
        disabled={isLoadingReply}
      />
    </main>
  );
}