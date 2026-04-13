"use client";

import { useState } from "react";

export default function MessageInput({ onSendMessage, disabled }) {
  const [value, setValue] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    setValue("");
    await onSendMessage(trimmed);
  }

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
          disabled={disabled}
        />

        <button
          type="submit"
          className="h-[48px] rounded-2xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
        >
          Send
        </button>
      </form>
    </footer>
  );
}