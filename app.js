class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = (this.getAttribute("role") || "ai").toLowerCase();
    const isUser = role === "user";

    const text = (this.textContent || "").trim();

    this.textContent = "";

    const wrapper = document.createElement("div");
    wrapper.className = isUser ? "flex justify-end" : "flex justify-start";

    const bubble = document.createElement("div");
    bubble.className = [
      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed border",
      isUser
        ? "bg-zinc-100 text-zinc-900 border-zinc-200"
        : "bg-zinc-900 text-zinc-100 border-zinc-800",
    ].join(" ");

    bubble.textContent = text || (isUser ? "…" : "");

    wrapper.appendChild(bubble);
    this.appendChild(wrapper);
  }
}

customElements.define("chat-message", ChatMessage);

const form = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

function addUserMessage(text) {
  const msg = document.createElement("chat-message");
  msg.setAttribute("role", "user");
  msg.textContent = text;

  messages.appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth", block: "end" });
}

if (form && messageInput && messages) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    messageInput.value = "";
    messageInput.focus();
  });

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
}
