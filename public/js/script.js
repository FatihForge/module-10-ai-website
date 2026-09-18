const promptForm = document.querySelector('#prompt-form');
const promptInput = document.querySelector('#prompt-input');
const generateButton = document.querySelector('#generate-button');
const buttonLabel = document.querySelector('.button-label');
const errorMessage = document.querySelector('#error-message');
const loadingMessage = document.querySelector('#loading-message');
const resultSection = document.querySelector('#result-section');
const resultText = document.querySelector('#result-text');
const chatMessages = document.querySelector('#chat-messages');
const welcomeMessage = document.querySelector('#welcome-message');
const newChatButton = document.querySelector('#new-chat-button');
const chatHistory = document.querySelector('#chat-history');
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('#menu-button');
const sidebarBackdrop = document.querySelector('#sidebar-backdrop');

const HISTORY_KEY = 'clarity-ai-chat-history';
const ACTIVE_CHAT_KEY = 'clarity-ai-active-chat';
const ACTIVE_CHAT_ID_KEY = 'clarity-ai-active-chat-id';
let currentMessages = [];
let currentChatId = readStorage(ACTIVE_CHAT_ID_KEY, null);

restoreActiveChat();
renderChatHistory();

promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    promptForm.requestSubmit();
  }
});

promptForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = promptInput.value.trim();
  clearError();

  if (!prompt) {
    showError('Please enter a prompt.');
    promptInput.focus();
    return;
  }

  setLoading(true);
  addMessage(prompt, 'user');
  promptInput.value = '';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'The request could not be completed.');
    }

    addMessage(data.result, 'assistant');
  } catch (error) {
    if (error instanceof TypeError) {
      showError('Unable to connect to the server. Please try again.');
    } else {
      showError(error.message);
    }
  } finally {
    setLoading(false);
  }
});

newChatButton.addEventListener('click', () => {
  archiveCurrentChat();
  clearCurrentChat();
  closeSidebar();
});

menuButton.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('is-open');
  sidebarBackdrop.classList.toggle('is-visible', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

sidebarBackdrop.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
  }
});

function setLoading(isLoading) {
  generateButton.disabled = isLoading;
  loadingMessage.hidden = !isLoading;
  buttonLabel.textContent = isLoading ? '...' : 'Send';
}

function addMessage(message, sender) {
  welcomeMessage.hidden = true;

  currentMessages.push({ message, sender });
  saveActiveChat();

  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}-message`;

  const label = document.createElement('span');
  label.className = 'message-label';
  label.textContent = sender === 'user' ? 'You' : 'Clarity AI';

  const text = document.createElement('p');
  text.className = 'message-text';
  text.textContent = message;

  messageElement.append(label, text);
  chatMessages.appendChild(messageElement);
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function restoreActiveChat() {
  const savedChat = readStorage(ACTIVE_CHAT_KEY, []);

  savedChat.forEach((item) => {
    addMessageToPage(item.message, item.sender);
  });

  currentMessages = savedChat;
  welcomeMessage.hidden = currentMessages.length > 0;
}

function addMessageToPage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}-message`;

  const label = document.createElement('span');
  label.className = 'message-label';
  label.textContent = sender === 'user' ? 'You' : 'Clarity AI';

  const text = document.createElement('p');
  text.className = 'message-text';
  text.textContent = message;

  messageElement.append(label, text);
  chatMessages.appendChild(messageElement);
}

function saveActiveChat() {
  localStorage.setItem(ACTIVE_CHAT_KEY, JSON.stringify(currentMessages));
}

function archiveCurrentChat() {
  if (currentMessages.length === 0) {
    return;
  }

  const history = readStorage(HISTORY_KEY, []);
  const firstUserMessage = currentMessages.find((item) => item.sender === 'user');

  const chatData = {
    id: currentChatId || Date.now(),
    title: firstUserMessage ? firstUserMessage.message : 'New conversation',
    messages: currentMessages,
    updatedAt: new Date().toISOString()
  };

  const existingChatIndex = history.findIndex((chat) => chat.id === currentChatId);

  if (existingChatIndex >= 0) {
    history[existingChatIndex] = chatData;
  } else {
    history.unshift(chatData);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  localStorage.removeItem(ACTIVE_CHAT_KEY);
  localStorage.removeItem(ACTIVE_CHAT_ID_KEY);
  currentChatId = null;
  renderChatHistory();
}

function clearCurrentChat() {
  currentMessages = [];
  chatMessages.querySelectorAll('.chat-message').forEach((message) => message.remove());
  welcomeMessage.hidden = false;
  clearError();
  promptInput.value = '';
  promptInput.focus();
}

function renderChatHistory() {
  const history = readStorage(HISTORY_KEY, []);
  chatHistory.textContent = '';

  history.forEach((chat) => {
    const historyButton = document.createElement('button');
    historyButton.type = 'button';
    historyButton.className = 'history-item';
    historyButton.textContent = chat.title;
    historyButton.title = chat.title;
    historyButton.addEventListener('click', () => {
      openSavedChat(chat.id);
      closeSidebar();
    });
    chatHistory.appendChild(historyButton);
  });
}

function openSavedChat(chatId) {
  const history = readStorage(HISTORY_KEY, []);
  const selectedChat = history.find((chat) => chat.id === chatId);

  if (!selectedChat) {
    return;
  }

  if (currentMessages.length > 0) {
    archiveCurrentChat();
  }

  currentMessages = selectedChat.messages;
  currentChatId = selectedChat.id;
  localStorage.setItem(ACTIVE_CHAT_KEY, JSON.stringify(currentMessages));
  localStorage.setItem(ACTIVE_CHAT_ID_KEY, JSON.stringify(currentChatId));
  chatMessages.querySelectorAll('.chat-message').forEach((message) => message.remove());
  currentMessages.forEach((item) => addMessageToPage(item.message, item.sender));
  welcomeMessage.hidden = true;
  renderChatHistory();
}

function readStorage(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch (error) {
    return fallback;
  }
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarBackdrop.classList.remove('is-visible');
  menuButton.setAttribute('aria-expanded', 'false');
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = '';
}
