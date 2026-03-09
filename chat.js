class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = (this.getAttribute("role") || "assistant").toLowerCase();
    const isUser = role === "user";

    const text = (this.textContent || "").trim();

    this.textContent = "";

    const wrapper = document.createElement("div");
    wrapper.className = isUser ? "flex justify-end" : "flex justify-start";

    const bubble = document.createElement("div");
    bubble.className = [
      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-wrap",
      isUser
        ? "bg-zinc-100 text-zinc-900 border-zinc-200"
        : "bg-zinc-900 text-zinc-100 border-zinc-800",
    ].join(" ");

    bubble.textContent = text;
    wrapper.appendChild(bubble);
    this.appendChild(wrapper);
  }
}

if (!customElements.get("chat-message")) {
  customElements.define("chat-message", ChatMessage);
}

export function appendMessage(container, role, text = "") {
  const message = document.createElement("chat-message");
  message.setAttribute("role", role);
  message.textContent = text;
  container.appendChild(message);
  scrollToBottom(container);
  return message;
}

export function updateMessage(messageElement, text) {
  const bubble = messageElement.querySelector("div > div");
  if (bubble) {
    bubble.textContent = text;
  }
}

export function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}
