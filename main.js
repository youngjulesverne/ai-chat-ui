import { streamChatCompletion } from "./api.js";
import { appendMessage, updateMessage, scrollToBottom } from "./chat.js";

const form = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

const messages = [];

let isSending = false;

function autoResizeTextarea() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${messageInput.scrollHeight}px`;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (isSending) {
    return;
  }

  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  isSending = true;

  appendMessage(messagesContainer, "user", text);
  messages.push({ role: "user", content: text });

  messageInput.value = "";
  autoResizeTextarea();
  messageInput.focus();

  const assistantMessageElement = appendMessage(
    messagesContainer,
    "assistant",
    "",
  );

  try {
    const assistantReply = await streamChatCompletion(messages, (fullText) => {
      updateMessage(assistantMessageElement, fullText);
      scrollToBottom(messagesContainer);
    });

    messages.push({
      role: "assistant",
      content: assistantReply,
    });
  } catch (error) {
    console.error(error);
    updateMessage(
      assistantMessageElement,
      `Something went wrong: ${error.message}`,
    );
  } finally {
    isSending = false;
  }
}

if (form && messageInput && messagesContainer) {
  form.addEventListener("submit", handleSubmit);

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  messageInput.addEventListener("input", autoResizeTextarea);
}
