// ═══════════════════════════════════════════════
// Chatbot Component (with Memory Persistence)
// ═══════════════════════════════════════════════

import { askLabAssistant } from '../services/ai.js';
import { getCurrentUser, saveChatHistory, getChatHistory } from '../services/supabase.js';

let currentTopic = null;
let messages = [];
let isOpen = false;
let isLoading = false;

export function setChatbotTopic(topic) {
  currentTopic = topic;
}

export function renderChatbot() {
  const chatEl = document.getElementById('chatbot');
  if (!chatEl) return;

  // Don't re-render if we're in the middle of a message unless necessary
  if (isLoading && document.getElementById('chatbot-messages')) return;

  chatEl.innerHTML = `
    <div class="chatbot ${isOpen ? 'chatbot--open' : ''}">
      <button class="chatbot__toggle" id="chatbot-toggle" title="AI Lab Assistant">
        🤖
      </button>
      <div class="chatbot__panel" id="chatbot-panel">
        <div class="chatbot__header">
          <div>
            <strong>ChemBot AI</strong>
            <span class="chatbot__context" id="chatbot-context">
              ${currentTopic ? `📌 Topic: ${currentTopic.name}` : '💬 General Chat'}
            </span>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="chatbot__clear-btn" id="chatbot-clear" title="Clear chat history">🗑️</button>
            <button class="btn btn--ghost btn--sm" id="chatbot-close" style="padding:4px 8px;">✕</button>
          </div>
        </div>
        <div class="chatbot__messages" id="chatbot-messages">
          ${messages.length === 0 ? `
            <div class="chatbot__message chatbot__message--bot">
              <div class="chatbot__message-text">
                👋 Hi! I'm your AI Chemistry Assistant.
                ${currentTopic
                  ? `I see you're working on <strong>${currentTopic.name}</strong>. How can I help?`
                  : 'How can I help you with your chemistry studies today?'}
              </div>
            </div>
          ` : messages.map(m => `
            <div class="chatbot__message chatbot__message--${m.role}">
              <div class="chatbot__message-text">${m.text}</div>
            </div>
          `).join('')}
          ${isLoading ? `
            <div class="chatbot__message chatbot__message--bot" id="typing-indicator">
              <div class="chatbot__typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          ` : ''}
        </div>
        <div class="chatbot__quick" id="chatbot-quick">
          <!-- Quick questions will be injected here -->
        </div>
        <div class="chatbot__input">
          <input type="text" class="input" id="chatbot-input"
            placeholder="${currentTopic ? `Ask about ${currentTopic.name}...` : 'Ask a chemistry question...'}"
            ${isLoading ? 'disabled' : ''} />
          <button class="btn btn--primary btn--sm" id="chatbot-send" ${isLoading ? 'disabled' : ''}>
            Send
          </button>
        </div>
      </div>
    </div>
  `;

  // Init sub-components
  initChatbotQuickQuestions();

  // Scroll messages to bottom
  const messagesEl = document.getElementById('chatbot-messages');
  if (messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Event listeners
  document.getElementById('chatbot-toggle')?.addEventListener('click', async () => {
    isOpen = !isOpen;
    if (isOpen && messages.length === 0) {
      await loadChatHistory();
    }
    renderChatbot();
  });

  document.getElementById('chatbot-close')?.addEventListener('click', () => {
    isOpen = false;
    renderChatbot();
  });

  document.getElementById('chatbot-clear')?.addEventListener('click', async () => {
    if (confirm('Clear your chat history for this topic?')) {
      messages = [];
      const user = await getCurrentUser();
      if (user) {
        await saveChatHistory(user.id, currentTopic?.id || 'general', []);
      }
      renderChatbot();
    }
  });

  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  const sendMessage = async () => {
    const text = input?.value?.trim();
    if (!text || isLoading) return;

    // Add user message
    messages.push({ role: 'user', text });
    isLoading = true;
    renderChatbot();

    try {
      // Build the question with more robust chat context
      const chatContext = messages.slice(-5, -1).map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
      const fullQuestion = chatContext 
        ? `[Chat Context]\n${chatContext}\n\n[Student's New Question]\n${text}`
        : text;

      const response = await askLabAssistant(fullQuestion, currentTopic);

      messages.push({ role: 'bot', text: response || 'Sorry, I am having trouble connecting to my brain. Please try again later!' });

      // Persist to Supabase
      const user = await getCurrentUser();
      if (user) {
        await saveChatHistory(user.id, currentTopic?.id || 'general', messages);
      }
    } catch (err) {
      console.error('Chat error:', err);
      messages.push({ role: 'bot', text: '⚠️ Sorry, I had trouble responding. Please try again.' });
    }

    isLoading = false;
    renderChatbot();
  };

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

async function loadChatHistory() {
  try {
    const user = await getCurrentUser();
    if (user) {
      const history = await getChatHistory(user.id, currentTopic?.id || 'general');
      if (history && history.length > 0) {
        messages = history;
      }
    }
  } catch (err) {
    console.error('Failed to load chat history:', err);
  }
}

export function initChatbotQuickQuestions() {
  const quickEl = document.getElementById('chatbot-quick');
  if (!quickEl) return;

  const questions = currentTopic ? [
    `What is ${currentTopic.name}?`,
    'Give me a challenge',
    '解釋一下 (Explain in CN)'
  ] : [
    'What are the states of matter?',
    'Explain the pH scale',
    'How do atoms form bonds?'
  ];

  quickEl.innerHTML = questions.map(q =>
    `<button class="chatbot__quick-btn">${q}</button>`
  ).join('');

  quickEl.querySelectorAll('.chatbot__quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('chatbot-input');
      if (input) {
        input.value = btn.textContent;
        const sendBtn = document.getElementById('chatbot-send');
        sendBtn?.click();
      }
    });
  });
}
