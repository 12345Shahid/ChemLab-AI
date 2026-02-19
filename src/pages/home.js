// ═══════════════════════════════════════════════
// Home Page
// ═══════════════════════════════════════════════

import { curriculum, getFormStats } from '../data/curriculum.js';

export function renderHome() {
  const f1 = getFormStats(1);
  const f2 = getFormStats(2);
  const f3 = getFormStats(3);

  return `
    <div class="hero animate-in">
      <div class="hero__badge animate-in animate-in-delay-1">
        🇭🇰 HK Government AI Education Grant Project
      </div>

      <h1 class="hero__title animate-in animate-in-delay-2">
        Virtual Chemistry Lab<br/><span>Powered by AI</span>
      </h1>

      <p class="hero__description animate-in animate-in-delay-3">
        Interactive PhET simulations and custom AI experiments for Hong Kong Form 1-3 students.
        With an intelligent lab assistant, auto-assessment, and real-time progress tracking.
      </p>

      <div class="hero__actions animate-in animate-in-delay-3">
        <a href="#curriculum" class="btn btn--primary btn--lg">
          📚 Explore Curriculum
        </a>
        <a href="#lab" class="btn btn--secondary btn--lg">
          🧪 Start a Lab
        </a>
      </div>

      <div class="hero__stats animate-in animate-in-delay-4">
        <div class="hero__stat">
          <div class="hero__stat-value">${curriculum.length}</div>
          <div class="hero__stat-label">Topics Covered</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">3</div>
          <div class="hero__stat-label">Form Levels</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">${curriculum.filter(t => t.phetUrl).length}</div>
          <div class="hero__stat-label">PhET Simulations</div>
        </div>
        <div class="hero__stat">
          <div class="hero__stat-value">${curriculum.filter(t => t.isCustomSim).length}</div>
          <div class="hero__stat-label">AI Custom Sims</div>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="section__header" style="text-align:center;">
        <h2 class="section__title">Choose Your Form</h2>
        <p class="section__subtitle">Select your class level to explore interactive chemistry experiments</p>
      </div>

      <div class="form-cards">
        <div class="glass-card form-card form-card--f1" onclick="location.hash='curriculum?form=1'">
          <div class="form-card__icon">🔬</div>
          <h3 class="form-card__title">Form 1</h3>
          <p class="form-card__desc">Foundations of chemistry — states of matter, particle theory, dissolving, and classification of substances.</p>
          <div class="form-card__count">${f1.total} topics • ${f1.covered} covered • ${f1.gap} custom AI sims</div>
        </div>

        <div class="glass-card form-card form-card--f2" onclick="location.hash='curriculum?form=2'">
          <div class="form-card__icon">⚗️</div>
          <h3 class="form-card__title">Form 2</h3>
          <p class="form-card__desc">Reactions and solutions — acids & alkalis, pH scale, gas tests, combustion, and neutralization.</p>
          <div class="form-card__count">${f2.total} topics • ${f2.covered} covered • ${f2.gap} custom AI sims</div>
        </div>

        <div class="glass-card form-card form-card--f3" onclick="location.hash='curriculum?form=3'">
          <div class="form-card__icon">🧬</div>
          <h3 class="form-card__title">Form 3</h3>
          <p class="form-card__desc">Atomic world — atomic structure, periodic table, bonding, chemical equations, and advanced topics.</p>
          <div class="form-card__count">${f3.total} topics • ${f3.covered} covered • ${f3.gap} custom AI sims</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header" style="text-align:center;">
        <h2 class="section__title">AI-Powered Features</h2>
        <p class="section__subtitle">Three core AI features to enhance learning and teaching</p>
      </div>

      <div class="grid grid--3">
        <div class="glass-card" style="text-align:center; padding:32px;">
          <div style="font-size:2.5rem; margin-bottom:16px;">🤖</div>
          <h3 style="font-size:1.1rem; margin-bottom:8px;">AI Lab Assistant</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
            Ask ChemBot any chemistry question in English or Chinese while doing experiments. Powered by Google Gemini.
          </p>
        </div>

        <div class="glass-card" style="text-align:center; padding:32px;">
          <div style="font-size:2.5rem; margin-bottom:16px;">✅</div>
          <h3 style="font-size:1.1rem; margin-bottom:8px;">Auto-Assessment</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
            AI generates quizzes for each topic and provides instant feedback on your answers. Track your progress over time.
          </p>
        </div>

        <div class="glass-card" style="text-align:center; padding:32px;">
          <div style="font-size:2.5rem; margin-bottom:16px;">📊</div>
          <h3 style="font-size:1.1rem; margin-bottom:8px;">Progress Dashboard</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
            Teachers can view per-student analytics, AI-generated insights, and predictive alerts for the entire class.
          </p>
        </div>
      </div>
    </section>
  `;
}
