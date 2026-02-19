// ═══════════════════════════════════════════════
// Curriculum Page — Topic Browser
// ═══════════════════════════════════════════════

import { curriculum, getTopicsByForm, getFormStats } from '../data/curriculum.js';

let activeForm = null;

export function renderCurriculum(params = {}) {
  // Check profile first, then params, then fallback
  const userForm = window.__chemlabProfile?.form;
  const isAdmin = window.__chemlabProfile?.role === 'admin';
  
  if (params.form) {
    activeForm = parseInt(params.form);
  } else if (activeForm === null || activeForm === undefined) {
    activeForm = userForm ? parseInt(userForm) : 1;
  }
  
  console.log('[Curriculum] Rendering form:', activeForm);
  const topics = getTopicsByForm(activeForm);
  const stats = getFormStats(activeForm);

  return `
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Chemistry Curriculum</h2>
        <p class="section__subtitle">
          Browse all ${curriculum.length} topics across Forms 1-3 of the HK Integrated Science syllabus.
        </p>
      </div>

      <div class="tabs" id="form-tabs">
        <button class="tab ${activeForm === 1 ? 'active' : ''} ${!isAdmin && userForm != 1 ? 'tab--disabled' : ''}" 
                data-form="1" ${!isAdmin && userForm != 1 ? 'disabled' : ''}>
          🔬 Form 1 (${getFormStats(1).total})
        </button>
        <button class="tab ${activeForm === 2 ? 'active' : ''} ${!isAdmin && userForm != 2 ? 'tab--disabled' : ''}" 
                data-form="2" ${!isAdmin && userForm != 2 ? 'disabled' : ''}>
          ⚗️ Form 2 (${getFormStats(2).total})
        </button>
        <button class="tab ${activeForm === 3 ? 'active' : ''} ${!isAdmin && userForm != 3 ? 'tab--disabled' : ''}" 
                data-form="3" ${!isAdmin && userForm != 3 ? 'disabled' : ''}>
          🧬 Form 3 (${getFormStats(3).total})
        </button>
      </div>

      <div class="flex gap-md" style="margin-bottom:24px; flex-wrap:wrap;">
        ${stats.covered > 0 ? `<div class="badge badge--covered">✓ ${stats.covered} Fully Covered</div>` : ''}
        ${stats.partial > 0 ? `<div class="badge badge--partial">◐ ${stats.partial} Partially Covered</div>` : ''}
      </div>

      <div class="grid grid--3" id="topic-grid">
        ${topics.map((topic, idx) => renderTopicCard(topic, idx)).join('')}
      </div>
    </section>
  `;
}

function renderTopicCard(topic, index) {
  const statusBadge = topic.phetUrl
    ? '<span class="badge badge--phet">PhET</span>'
    : topic.externalLabUrl
      ? `<span class="badge badge--custom">${topic.externalLabName || 'External'}</span>`
      : '<span class="badge badge--partial">AI-Enhanced</span>';

  const formBadge = `<span class="badge badge--form${topic.form}">F${topic.form}</span>`;

  return `
    <div class="glass-card topic-card animate-in animate-in-delay-${(index % 4) + 1}"
         onclick="location.hash='lab?topic=${topic.id}'"
         style="cursor:pointer;">
      <div class="topic-card__header">
        <span class="topic-card__num">#${topic.id.split('-')[1]}</span>
      </div>
      <h3 class="topic-card__title">${topic.name}</h3>
      <p class="topic-card__desc">${topic.description}</p>
      <div class="topic-card__footer">
        ${formBadge}
        <span class="badge" style="opacity:0.6;">${topic.category}</span>
      </div>
    </div>
  `;
}

export function initCurriculumEvents() {
  document.querySelectorAll('#form-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeForm = parseInt(tab.dataset.form);
      location.hash = `curriculum?form=${activeForm}`;
    });
  });
}
