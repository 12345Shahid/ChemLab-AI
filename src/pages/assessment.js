// ═══════════════════════════════════════════════
// Assessment Page — AI-Powered Quizzes (Supabase)
// ═══════════════════════════════════════════════

import { curriculum, getTopicById } from '../data/curriculum.js';
import { generateQuiz } from '../services/ai.js';
import { getCurrentUser, saveQuizResultDB, getQuizResultsDB } from '../services/supabase.js';

let currentQuiz = null;
let currentTopicId = null;
let currentQuestionIndex = 0;
let answers = [];
let showingResults = false;
let previousQuestions = []; // Track questions to avoid repeats

export function renderAssessment(params = {}) {
  if (params.topic) currentTopicId = params.topic;
  const topic = currentTopicId ? getTopicById(currentTopicId) : null;

  if (showingResults && currentQuiz) {
    return renderResults(topic);
  }

  if (currentQuiz && currentTopicId) {
    return renderQuizInProgress(topic);
  }

  return renderAssessmentHome(topic);
}

function renderAssessmentHome(preselectedTopic) {
  const isAdmin = window.__chemlabProfile?.role === 'admin';
  const userForm = parseInt(window.__chemlabProfile?.form || '1');

  return `
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">AI Assessment</h2>
        <p class="section__subtitle">
          Select a topic to generate an AI-powered quiz. Each quiz has 5 multiple-choice questions
          tailored to the HK chemistry curriculum.
        </p>
      </div>

      <div class="assessment-layout">
        <div class="glass-card glass-card--static" style="margin-bottom:24px; padding:28px;">
          <h3 style="margin-bottom:16px;">📝 Start a New Quiz</h3>

          <div style="margin-bottom:16px;">
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
              Select Topic
            </label>
            <select class="input" id="quiz-topic-select" style="cursor:pointer;">
              <option value="">-- Choose a topic --</option>
              ${(isAdmin || userForm === 1) ? `
              <optgroup label="📘 Form 1">
                ${curriculum.filter(t => t.form === 1).map(t =>
                  `<option value="${t.id}" ${preselectedTopic?.id === t.id ? 'selected' : ''}>${t.name}</option>`
                ).join('')}
              </optgroup>` : ''}
              ${(isAdmin || userForm === 2) ? `
              <optgroup label="📗 Form 2">
                ${curriculum.filter(t => t.form === 2).map(t =>
                  `<option value="${t.id}" ${preselectedTopic?.id === t.id ? 'selected' : ''}>${t.name}</option>`
                ).join('')}
              </optgroup>` : ''}
              ${(isAdmin || userForm === 3) ? `
              <optgroup label="📙 Form 3">
                ${curriculum.filter(t => t.form === 3).map(t =>
                  `<option value="${t.id}" ${preselectedTopic?.id === t.id ? 'selected' : ''}>${t.name}</option>`
                ).join('')}
              </optgroup>` : ''}
            </select>
          </div>

          <div style="margin-bottom:20px;">
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
              Difficulty
            </label>
            <div class="tabs" id="difficulty-tabs" style="margin-bottom:0;">
              <button class="tab" data-diff="easy">Easy</button>
              <button class="tab active" data-diff="medium">Medium</button>
              <button class="tab" data-diff="hard">Hard</button>
            </div>
          </div>

          <button class="btn btn--primary btn--lg" style="width:100%;" id="generate-quiz-btn">
            🤖 Generate AI Quiz
          </button>
        </div>

        <div id="quiz-loading" style="display:none; text-align:center; padding:40px;">
          <div class="sim-emoji">🤖</div>
          <p style="margin-top:16px; color:var(--text-secondary);">AI is generating your quiz...</p>
          <div class="progress-bar" style="max-width:300px; margin:16px auto;">
            <div class="progress-bar__fill" style="width:60%; animation: pulse 1s infinite;"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderQuizInProgress(topic) {
  const q = currentQuiz.questions[currentQuestionIndex];
  const totalQ = currentQuiz.questions.length;
  const answered = answers[currentQuestionIndex] !== undefined;

  return `
    <section class="section">
      <div class="assessment-layout">
        <div class="flex justify-between items-center" style="margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.3rem; font-weight:700;">
              ${topic ? topic.name : 'Chemistry Quiz'}
            </h2>
            <p style="font-size:0.85rem; color:var(--text-secondary);">
              Question ${currentQuestionIndex + 1} of ${totalQ}
            </p>
          </div>
          <div class="flex gap-sm items-center">
            <div class="progress-bar" style="width:120px;">
              <div class="progress-bar__fill" style="width:${((currentQuestionIndex + 1) / totalQ) * 100}%;"></div>
            </div>
            <span style="font-size:0.8rem; color:var(--text-muted);">${currentQuestionIndex + 1}/${totalQ}</span>
          </div>
        </div>

        <div class="glass-card glass-card--static" style="padding:32px;">
          <div class="quiz-question">
            <div class="quiz-question__num">Question ${currentQuestionIndex + 1}</div>
            <div class="quiz-question__text">${q.question}</div>
            <div class="quiz-options" id="quiz-options">
              ${q.options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (answered) {
                  if (idx === q.correctIndex) cls += ' correct';
                  else if (idx === answers[currentQuestionIndex] && idx !== q.correctIndex) cls += ' incorrect';
                } else if (answers[currentQuestionIndex] === idx) {
                  cls += ' selected';
                }
                return `
                  <div class="${cls}" data-option="${idx}">
                    <div class="quiz-option__letter">${String.fromCharCode(65 + idx)}</div>
                    <span>${opt.replace(/^[A-D]\)\s*/, '')}</span>
                  </div>
                `;
              }).join('')}
            </div>

            ${answered ? `
              <div class="quiz-feedback quiz-feedback--${answers[currentQuestionIndex] === q.correctIndex ? 'correct' : 'incorrect'}">
                ${answers[currentQuestionIndex] === q.correctIndex
                  ? '✅ Correct! '
                  : `❌ Incorrect. The correct answer is ${String.fromCharCode(65 + q.correctIndex)}. `
                }
                ${q.explanation}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="flex justify-between" style="margin-top:20px;">
          <button class="btn btn--ghost" ${currentQuestionIndex === 0 ? 'disabled style="opacity:0.3"' : ''}
                  id="quiz-prev-btn">
            ← Previous
          </button>
          ${answered
            ? currentQuestionIndex < totalQ - 1
              ? '<button class="btn btn--primary" id="quiz-next-btn">Next →</button>'
              : '<button class="btn btn--primary" id="quiz-finish-btn">📊 See Results</button>'
            : ''
          }
        </div>
      </div>
    </section>
  `;
}

function renderResults(topic) {
  const totalQ = currentQuiz.questions.length;
  const correct = answers.filter((a, i) => a === currentQuiz.questions[i].correctIndex).length;
  const score = Math.round((correct / totalQ) * 100);

  // Save result to Supabase (async, don't block render)
  saveResultToSupabase(currentTopicId, score, totalQ, correct);

  // Store questions to avoid on retake
  previousQuestions = currentQuiz.questions.map(q => q.question);

  let grade = '';
  if (score >= 80) grade = '🌟 Excellent!';
  else if (score >= 60) grade = '👍 Good Work!';
  else if (score >= 40) grade = '📚 Keep Practicing!';
  else grade = '💪 Don\'t Give Up!';

  return `
    <section class="section">
      <div class="assessment-layout">
        <div class="glass-card glass-card--static" style="padding:40px;">
          <div class="quiz-score">
            <div class="quiz-score__value">${score}%</div>
            <div class="quiz-score__label">${grade}</div>
            <p style="color:var(--text-secondary); margin-top:8px; font-size:0.9rem;">
              You got ${correct} out of ${totalQ} questions correct
            </p>
          </div>

          <div style="max-width:400px; margin:24px auto;">
            <div class="progress-bar" style="height:10px;">
              <div class="progress-bar__fill" style="width:${score}%;
                ${score >= 80 ? 'background:var(--accent-emerald);' : score >= 60 ? '' : score >= 40 ? 'background:var(--accent-amber);' : 'background:var(--accent-rose);'}
              "></div>
            </div>
          </div>

          <div style="text-align:center; margin-top:32px;">
            <h3 style="margin-bottom:16px;">Review Your Answers</h3>
            ${currentQuiz.questions.map((q, i) => `
              <div style="text-align:left; margin-bottom:16px; padding:16px; border-radius:var(--radius-sm);
                background:${answers[i] === q.correctIndex ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)'};
                border:1px solid ${answers[i] === q.correctIndex ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'};">
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">
                  Q${i + 1} ${answers[i] === q.correctIndex ? '✅' : '❌'}
                </div>
                <div style="font-size:0.9rem; margin-bottom:8px;">${q.question}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">${q.explanation}</div>
              </div>
            `).join('')}
          </div>

          <div class="flex gap-md justify-between" style="margin-top:24px; flex-wrap:wrap;">
            <div class="flex gap-sm">
              <button class="btn btn--secondary btn--sm" id="retake-same-btn">🔄 Retake Same</button>
              <button class="btn btn--primary btn--sm" id="retake-new-btn">✨ New Questions</button>
            </div>
            <button class="btn btn--ghost btn--sm" onclick="location.hash='${topic ? `lab?topic=${topic.id}` : 'curriculum'}'">
              ${topic ? '🧪 Back to Lab' : '📚 Browse Topics'}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function saveResultToSupabase(topicId, score, total, correct) {
  try {
    const user = await getCurrentUser();
    if (user) {
      await saveQuizResultDB(user.id, topicId, {
        score,
        total,
        correct,
        questions: currentQuiz.questions,
        answers
      });
    }
  } catch (err) {
    console.error('Failed to save quiz result:', err);
  }
}

export function initAssessmentEvents() {
  // Difficulty tabs
  document.querySelectorAll('#difficulty-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#difficulty-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Generate quiz
  const genBtn = document.getElementById('generate-quiz-btn');
  if (genBtn) {
    genBtn.addEventListener('click', async () => {
      const select = document.getElementById('quiz-topic-select');
      const topicId = select?.value;
      if (!topicId) {
        alert('Please select a topic first.');
        return;
      }

      const topic = getTopicById(topicId);
      const activeDiff = document.querySelector('#difficulty-tabs .tab.active');
      const difficulty = activeDiff?.dataset.diff || 'medium';

      const loading = document.getElementById('quiz-loading');
      genBtn.disabled = true;
      genBtn.textContent = '⏳ Generating...';
      if (loading) loading.style.display = 'block';

      // Pass previous questions to avoid repeats
      currentQuiz = await generateQuiz(topic, difficulty, 5, previousQuestions);
      currentTopicId = topicId;
      currentQuestionIndex = 0;
      answers = [];
      showingResults = false;

      location.hash = `assessment?topic=${topicId}`;
    });
  }

  // Option selection
  document.querySelectorAll('#quiz-options .quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      if (answers[currentQuestionIndex] !== undefined) return;
      const idx = parseInt(option.dataset.option);
      answers[currentQuestionIndex] = idx;
      const main = document.getElementById('main-content');
      const topic = getTopicById(currentTopicId);
      main.innerHTML = renderQuizInProgress(topic);
      initAssessmentEvents();
    });
  });

  // Navigation
  const prevBtn = document.getElementById('quiz-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        const main = document.getElementById('main-content');
        const topic = getTopicById(currentTopicId);
        main.innerHTML = renderQuizInProgress(topic);
        initAssessmentEvents();
      }
    });
  }

  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      const main = document.getElementById('main-content');
      const topic = getTopicById(currentTopicId);
      main.innerHTML = renderQuizInProgress(topic);
      initAssessmentEvents();
    });
  }

  const finishBtn = document.getElementById('quiz-finish-btn');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      showingResults = true;
      const main = document.getElementById('main-content');
      const topic = getTopicById(currentTopicId);
      main.innerHTML = renderResults(topic);
      initAssessmentEvents();
    });
  }

  // Retake Same Questions
  const retakeSameBtn = document.getElementById('retake-same-btn');
  if (retakeSameBtn) {
    retakeSameBtn.addEventListener('click', () => {
      showingResults = false;
      answers = [];
      currentQuestionIndex = 0;
      const main = document.getElementById('main-content');
      const topic = getTopicById(currentTopicId);
      main.innerHTML = renderQuizInProgress(topic);
      initAssessmentEvents();
    });
  }

  // Retake New Questions (Regeneration)
  const retakeNewBtn = document.getElementById('retake-new-btn');
  if (retakeNewBtn) {
    retakeNewBtn.addEventListener('click', async () => {
      showingResults = false;
      answers = [];
      currentQuestionIndex = 0;

      // Show loading state
      const main = document.getElementById('main-content');
      main.innerHTML = `
        <section class="section">
          <div class="assessment-layout" style="text-align:center; padding:60px 20px;">
            <div class="sim-emoji">🤖</div>
            <p style="margin-top:16px; color:var(--text-secondary);">Generating new questions...</p>
            <div class="progress-bar" style="max-width:300px; margin:16px auto;">
              <div class="progress-bar__fill" style="width:60%; animation: pulse 1s infinite;"></div>
            </div>
          </div>
        </section>
      `;

      // Regenerate quiz with avoidQuestions
      const topic = getTopicById(currentTopicId);
      const activeDiff = document.querySelector('#difficulty-tabs .tab.active'); // Fallback to medium if not found
      const difficulty = activeDiff?.dataset.diff || 'medium';
      
      currentQuiz = await generateQuiz(topic, difficulty, 5, previousQuestions);

      main.innerHTML = renderQuizInProgress(topic);
      initAssessmentEvents();
    });
  }
}

// Reset state when leaving assessment
export function resetAssessment() {
  currentQuiz = null;
  currentQuestionIndex = 0;
  answers = [];
  showingResults = false;
}
