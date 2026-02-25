const form = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

function addMessage(text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "message--user");
  messageDiv.textContent = text;

  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text);
  messageInput.value = "";
  messageInput.focus();
});
