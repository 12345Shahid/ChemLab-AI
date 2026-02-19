// ═══════════════════════════════════════════════
// Lab Page — Simulation Viewer + AI Chatbot
// ═══════════════════════════════════════════════

import { getTopicById, curriculum } from '../data/curriculum.js';
import { setChatbotTopic } from '../components/chatbot.js';
import { saveTopicProgress, getTopicProgressDB } from '../services/supabase.js';

let timeTracker = null;
let currentTopicId = null;

export function renderLab(params = {}) {
  const topicId = params.topic;
  const topic = topicId ? getTopicById(topicId) : null;

  if (!topic) {
    return renderLabSelector();
  }

  currentTopicId = topicId;
  setChatbotTopic(topic);
  startTimeTracking(topicId);

  // Determine badge and viewport content
  const badgeHtml = getBadgeForTopic(topic);
  const viewportHtml = getViewportForTopic(topic);

  return `
    <div class="lab-layout">
      <div class="lab-main">
        <div class="lab-topbar">
          <div class="lab-topbar__info">
            <h2 class="lab-topbar__title">${topic.name}</h2>
            <div class="lab-topbar__meta">
              <span class="badge badge--form${topic.form}">Form ${topic.form}</span>
              <span>${topic.category}</span>
            </div>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn--secondary btn--sm" onclick="location.hash='assessment?topic=${topic.id}'">
              ✅ Take Quiz
            </button>
            <button class="btn btn--ghost btn--sm" id="mark-complete-btn">
              ☑ Mark Complete
            </button>
            <a href="#curriculum?form=${topic.form}" class="btn btn--ghost btn--sm">← Back</a>
          </div>
        </div>

        <div class="lab-viewport">
          ${viewportHtml}
        </div>
      </div>
    </div>
  `;
}

function getBadgeForTopic(topic) {
  if (topic.phetUrl) return '<span class="badge badge--phet">PhET Simulation</span>';
  if (topic.externalLabUrl) return `<span class="badge badge--custom">${topic.externalLabName || 'External Lab'}</span>`;
  return '<span class="badge badge--custom">AI-Enhanced</span>';
}

function getViewportForTopic(topic) {
  // Case 1: PhET simulation — embed directly
  if (topic.phetUrl) {
    return `<iframe
              src="${topic.phetUrl}"
              title="${topic.name} - PhET Simulation"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              loading="lazy"
            ></iframe>`;
  }

  // Case 2: External Lab URL — show link + AI assistant prompt
  if (topic.externalLabUrl) {
    return `
      <div class="lab-viewport__custom-sim">
        <div class="custom-sim" style="margin:0 auto;">
          <div style="text-align:center; padding:40px 20px;">
            <div class="sim-emoji" style="font-size:4rem;">🔬</div>
            <h3 style="margin:16px 0 8px; font-size:1.3rem;">${topic.name}</h3>
            <p style="color:var(--text-secondary); margin-bottom:8px; line-height:1.6;">
              ${topic.description}
            </p>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:24px;">
              Powered by <strong>${topic.externalLabName}</strong> — opens in a new tab
            </p>
            <a href="${topic.externalLabUrl}" target="_blank" rel="noopener noreferrer"
               class="btn btn--primary btn--lg" style="display:inline-flex; gap:8px; align-items:center;">
              🧪 Open Virtual Lab ↗
            </a>
            <div style="margin-top:32px; padding:20px; background:var(--bg-glass); border-radius:var(--radius-md); border:1px solid var(--border-subtle); text-align:left;">
              <h4 style="margin-bottom:12px; font-size:0.9rem;">📋 Learning Objectives</h4>
              <ul style="padding-left:20px; color:var(--text-secondary); font-size:0.85rem; line-height:1.8;">
                ${topic.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <p style="color:var(--text-muted); font-size:0.82rem; margin-top:16px;">
              💡 Use the <strong>AI Lab Assistant</strong> (bottom-right 🤖) for guidance while exploring the lab
            </p>
          </div>
        </div>
      </div>`;
  }

  // Case 3: No URL at all — AI-enhanced fallback
  return `
    <div class="lab-viewport__custom-sim">
      <div class="custom-sim" style="margin:0 auto; text-align:center; padding:40px;">
        <div class="sim-emoji" style="font-size:4rem;">🤖</div>
        <h3 style="margin:16px 0 8px;">AI-Enhanced Learning</h3>
        <p style="color:var(--text-secondary); margin-bottom:16px;">
          Use the AI Lab Assistant to explore ${topic.name} interactively.
        </p>
        <p style="color:var(--text-muted); font-size:0.85rem;">
          Click the 🤖 button at the bottom-right to start a conversation about this topic.
        </p>
      </div>
    </div>`;
}

function renderLabSelector() {
  const isAdmin = window.__chemlabProfile?.role === 'admin';
  const userForm = window.__chemlabProfile?.form || 'all';

  return `
    <section class="section">
      <div class="section__header" style="text-align:center;">
        <h2 class="section__title">Choose an Experiment</h2>
        <p class="section__subtitle">Select a topic from the curriculum to start a virtual lab session</p>
      </div>

      <div class="tabs" style="justify-content:center; margin:0 auto 32px;">
        ${isAdmin ? `<button class="tab ${userForm === 'all' ? 'active' : ''} lab-form-tab" data-form="all">All</button>` : ''}
        <button class="tab ${userForm == 1 ? 'active' : ''} ${!isAdmin && userForm != 1 ? 'tab--disabled' : ''} lab-form-tab" 
                data-form="1" ${!isAdmin && userForm != 1 ? 'disabled' : ''}>Form 1</button>
        <button class="tab ${userForm == 2 ? 'active' : ''} ${!isAdmin && userForm != 2 ? 'tab--disabled' : ''} lab-form-tab" 
                data-form="2" ${!isAdmin && userForm != 2 ? 'disabled' : ''}>Form 2</button>
        <button class="tab ${userForm == 3 ? 'active' : ''} ${!isAdmin && userForm != 3 ? 'tab--disabled' : ''} lab-form-tab" 
                data-form="3" ${!isAdmin && userForm != 3 ? 'disabled' : ''}>Form 3</button>
      </div>

      <div class="grid grid--3" id="lab-topic-grid">
        ${curriculum.map((topic, idx) => {
          const isHidden = userForm !== 'all' && topic.form != userForm;
          return `
            <div class="glass-card topic-card animate-in animate-in-delay-${(idx % 4) + 1}"
                 onclick="location.hash='lab?topic=${topic.id}'"
                 style="${isHidden ? 'display:none;' : ''}"
                 data-form="${topic.form}">
              <div class="topic-card__header">
              </div>
              <h3 class="topic-card__title">${topic.name}</h3>
              <p class="topic-card__desc">${topic.description}</p>
              <div class="topic-card__footer">
                <span class="badge badge--form${topic.form}">Form ${topic.form}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function startTimeTracking(topicId) {
  if (timeTracker) clearInterval(timeTracker);
  const user = window.__chemlabUser;
  if (!user) return;

  timeTracker = setInterval(async () => {
    try {
      const current = await getTopicProgressDB(user.id, topicId);
      await saveTopicProgress(user.id, topicId, (current?.time_spent || 0) + 10, current?.completed || false);
    } catch (err) {
      console.warn('Time tracking sync failed');
    }
  }, 10000); // track every 10 seconds
}

export function cleanupLab() {
  if (timeTracker) {
    clearInterval(timeTracker);
    timeTracker = null;
  }
}

export function initLabEvents() {
  const markBtn = document.getElementById('mark-complete-btn');
  const user = window.__chemlabUser;
  
  console.log('[Lab] Initializing events. User:', user?.id, 'Topic:', currentTopicId);

  if (markBtn && currentTopicId && user) {
    // Initial state check
    getTopicProgressDB(user.id, currentTopicId).then(progress => {
      console.log('[Lab] Initial progress status:', progress);
      if (progress?.completed) {
        markBtn.textContent = '✅ Completed';
        markBtn.classList.add('btn--completed');
        markBtn.dataset.completed = 'true';
      }
    });

    markBtn.addEventListener('click', async () => {
      const isCompleted = markBtn.dataset.completed === 'true';
      const newState = !isCompleted;

      // Optimistic UI
      markBtn.textContent = newState ? '✅ Completed' : '☑ Mark Complete';
      markBtn.dataset.completed = newState ? 'true' : 'false';
      if (newState) markBtn.classList.add('btn--completed');
      else markBtn.classList.remove('btn--completed');

      try {
        // We need the current time spent to not overwrite it
        const current = await getTopicProgressDB(user.id, currentTopicId);
        await saveTopicProgress(user.id, currentTopicId, current?.time_spent || 0, newState);
      } catch (err) {
        console.error('Failed to toggle completion:', err);
        // Revert on error
        markBtn.textContent = isCompleted ? '✅ Completed' : '☑ Mark Complete';
        markBtn.dataset.completed = isCompleted ? 'true' : 'false';
      }
    });
  }

  // Lab form filter tabs
  document.querySelectorAll('.lab-form-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lab-form-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const form = tab.dataset.form;
      document.querySelectorAll('#lab-topic-grid .topic-card').forEach(card => {
        const cardParent = card.closest('[data-form]');
        if (cardParent) {
          cardParent.style.display = (form === 'all' || cardParent.dataset.form === form) ? '' : 'none';
        }
      });
    });
  });
}
