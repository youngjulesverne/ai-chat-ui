"use client";

function getMessageText(message) {
  if (!message?.parts) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-100"
        }`}
      >
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
          {isUser ? "You" : "Assistant"}
        </div>
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
}