// ═══════════════════════════════════════════════
// Dashboard Page — Admin & Student Views
// ═══════════════════════════════════════════════

import { curriculum, getTopicById } from '../data/curriculum.js';
import {
  getCurrentUser, getProfile,
  getAllStudents, getStudentQuizResults,
  getQuizResultsDB, getTopicProgressDB
} from '../services/supabase.js';

let isAdmin = false;
let students = [];
let selectedStudentId = null;
let selectedStudentProfile = null;
let studentResults = [];
let studentProgress = [];
let loadingData = false;
let currentProfileRef = null;

export function renderDashboard(params = {}, profile = null) {
  currentProfileRef = profile || window.__chemlabProfile;
  isAdmin = currentProfileRef?.role === 'admin';

  if (params.student) {
    selectedStudentId = params.student;
  }

  if (isAdmin && !selectedStudentId) {
    return renderAdminDashboard();
  }

  return renderStudentDashboard();
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// ─── Admin Dashboard ───

function renderAdminDashboard() {
  return `
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">👨‍🏫 Teacher Dashboard</h2>
        <p class="section__subtitle">
          Monitor all students' progress, quiz scores, and lab activity
        </p>
      </div>

      <div id="admin-loading" style="text-align:center; padding:40px;">
        <div class="sim-emoji">📊</div>
        <p style="margin-top:12px; color:var(--text-secondary);">Loading student data...</p>
      </div>

      <div id="admin-content" style="display:none;">
        <div class="grid grid--3" style="margin-bottom:32px;" id="admin-stats">
        </div>
        <div class="glass-card glass-card--static" style="padding:24px;">
          <h3 style="margin-bottom:20px;">👥 All Students</h3>
          <div id="students-list">
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStudentDashboard() {
  const viewingOwn = !selectedStudentId || selectedStudentId === currentProfileRef?.id;
  const displayName = viewingOwn
    ? currentProfileRef?.username || 'You'
    : selectedStudentProfile?.username || 'Student';
  
  const studentForm = viewingOwn ? currentProfileRef?.form : selectedStudentProfile?.form;

  return `
    <section class="section">
      <div class="section__header">
        <div class="flex justify-between items-center" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h2 class="section__title">
              ${viewingOwn ? '📊 My Dashboard' : `📊 ${displayName}'s Dashboard`}
            </h2>
            <p class="section__subtitle">
              ${viewingOwn ? 'Track your learning progress and quiz performance' : `Viewing ${displayName}'s progress`}
              ${studentForm ? `· <span class="badge badge--form${studentForm}">Form ${studentForm}</span>` : ''}
            </p>
          </div>
          ${isAdmin && !viewingOwn ? `
            <button class="btn btn--ghost btn--sm" onclick="location.hash='dashboard'">
              ← Back to All Students
            </button>
          ` : ''}
        </div>
      </div>

      <div id="dashboard-loading" style="text-align:center; padding:40px;">
        <div class="sim-emoji">📊</div>
        <p style="margin-top:12px; color:var(--text-secondary);">Loading progress data...</p>
      </div>

      <div id="dashboard-content" style="display:none;">
        <div class="grid grid--4" style="margin-bottom:32px;" id="student-stats">
        </div>

        <div id="completed-labs-details" class="glass-card glass-card--static" style="display:none; padding:24px; margin-bottom:32px; border-color:var(--accent-secondary); border-width:2px;">
          <h3 style="margin-bottom:16px; display:flex; align-items:center; gap:8px;">
            🎓 Completed Labs
            <span class="badge badge--secondary" id="completed-labs-count">0</span>
          </h3>
          <div id="completed-labs-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:12px;">
            <!-- Lab list will be injected here -->
          </div>
        </div>

        <div class="grid grid--1" style="margin-bottom:24px;">
          <div class="glass-card glass-card--static" style="padding:24px;">
            <h3 style="margin-bottom:16px;">📝 Recent Quiz Results</h3>
            <div id="recent-quizzes"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ─── Event Handlers ───

export function initDashboardEvents() {
  if (isAdmin && !selectedStudentId) {
    loadAdminData();
  } else {
    loadStudentData();
  }
}

async function loadAdminData() {
  try {
    students = await getAllStudents();

    // Get quiz results for each student
    const resultsMap = {};
    for (const s of students) {
      resultsMap[s.id] = await getStudentQuizResults(s.id);
    }

    const loadingEl = document.getElementById('admin-loading');
    const contentEl = document.getElementById('admin-content');
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // Stats
    const totalQuizzes = Object.values(resultsMap).flat().length;
    const avgScore = totalQuizzes > 0
      ? Math.round(Object.values(resultsMap).flat().reduce((s, r) => s + r.score, 0) / totalQuizzes)
      : 0;

    const statsEl = document.getElementById('admin-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="glass-card glass-card--static" style="padding:20px; text-align:center;">
          <div style="font-size:2rem; font-weight:700; color:var(--accent-primary);">${students.length}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Total Students</div>
        </div>
        <div class="glass-card glass-card--static" style="padding:20px; text-align:center;">
          <div style="font-size:2rem; font-weight:700; color:var(--accent-emerald);">${totalQuizzes}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Quizzes Taken</div>
        </div>
        <div class="glass-card glass-card--static" style="padding:20px; text-align:center;">
          <div style="font-size:2rem; font-weight:700; color:var(--accent-amber);">${avgScore}%</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Avg Score</div>
        </div>
      `;
    }

    // Students list
    const listEl = document.getElementById('students-list');
    if (listEl) {
      if (students.length === 0) {
        listEl.innerHTML = `
          <p style="color:var(--text-muted); text-align:center; padding:20px;">
            No students registered yet.
          </p>
        `;
        return;
      }

      listEl.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <th style="text-align:left; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Username</th>
              <th style="text-align:left; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Name</th>
              <th style="text-align:center; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Form</th>
              <th style="text-align:center; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Quizzes</th>
              <th style="text-align:center; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Avg Score</th>
              <th style="text-align:right; padding:12px 8px; font-size:0.8rem; color:var(--text-muted); font-weight:500;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const sResults = resultsMap[s.id] || [];
              const sAvg = sResults.length > 0
                ? Math.round(sResults.reduce((sum, r) => sum + r.score, 0) / sResults.length)
                : 0;
              const scoreColor = sAvg >= 80 ? 'var(--accent-emerald)' : sAvg >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)';
              return `
                <tr style="border-bottom:1px solid var(--border-subtle); cursor:pointer;"
                    class="student-row" data-student="${s.id}"
                    onmouseover="this.style.background='var(--bg-glass)'"
                    onmouseout="this.style.background='transparent'">
                  <td style="padding:14px 8px; font-weight:600; font-size:0.9rem;">@${s.username}</td>
                  <td style="padding:14px 8px; font-size:0.85rem; color:var(--text-secondary);">${s.full_name || '-'}</td>
                  <td style="padding:14px 8px; text-align:center;">
                    <span class="badge badge--form${s.form}">F${s.form}</span>
                  </td>
                  <td style="padding:14px 8px; text-align:center; font-size:0.9rem;">${sResults.length}</td>
                  <td style="padding:14px 8px; text-align:center; font-weight:600; color:${scoreColor};">
                    ${sResults.length > 0 ? `${sAvg}%` : '-'}
                  </td>
                  <td style="padding:14px 8px; text-align:right;">
                    <button class="btn btn--ghost btn--sm view-student-btn" data-student="${s.id}"
                      style="font-size:0.75rem;">
                      View →
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;

      // Click handlers for student rows
      listEl.querySelectorAll('.student-row').forEach(row => {
        row.addEventListener('click', () => {
          const sid = row.dataset.student;
          location.hash = `dashboard?student=${sid}`;
        });
      });
    }
  } catch (err) {
    console.error('Admin data load error:', err);
    const loadingEl = document.getElementById('admin-loading');
    if (loadingEl) {
      loadingEl.innerHTML = `
        <p style="color:var(--accent-rose);">⚠️ Failed to load data. Please check your connection.</p>
      `;
    }
  }
}

async function loadStudentData() {
  try {
    const targetId = selectedStudentId || currentProfileRef?.id;
    if (!targetId) return;

    // If admin viewing a student, load that student's profile
    if (selectedStudentId && selectedStudentId !== currentProfileRef?.id) {
      selectedStudentProfile = await getProfile(selectedStudentId);
    }

    studentResults = await getStudentQuizResults(targetId);
    studentProgress = await getTopicProgressDB(targetId);

    // If results are empty, double check if it's just a timing issue
    if (studentResults.length === 0) {
      await sleep(500);
      studentResults = await getStudentQuizResults(targetId);
    }

    const loadingEl = document.getElementById('dashboard-loading');
    const contentEl = document.getElementById('dashboard-content');
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // Stats cards
    const totalQuizzes = studentResults.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(studentResults.reduce((s, r) => s + r.score, 0) / totalQuizzes)
      : 0;
    const topicsCompleted = studentProgress.filter(p => p.completed).length;
    const totalTime = studentProgress.reduce((s, p) => s + (p.time_spent || 0), 0);
    const timeMin = Math.round(totalTime / 60);

    const statsEl = document.getElementById('student-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="glass-card glass-card--static" style="padding:16px; text-align:center;">
          <div style="font-size:1.8rem; font-weight:700; color:var(--accent-primary);">${totalQuizzes}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Quizzes Taken</div>
        </div>
        <div class="glass-card glass-card--static" style="padding:16px; text-align:center;">
          <div style="font-size:1.8rem; font-weight:700; color:${avgScore >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">${avgScore}%</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Avg Score</div>
        </div>
        <div class="glass-card glass-card--static" id="stat-card-completed" style="padding:16px; text-align:center; cursor:pointer; transition:all 0.2s;">
          <div style="font-size:1.8rem; font-weight:700; color:var(--accent-secondary);">${topicsCompleted}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; display:flex; align-items:center; justify-content:center; gap:4px;">
            Completed <span style="font-size:0.9rem;">ⓘ</span>
          </div>
          <div style="font-size:0.6rem; color:var(--accent-secondary); margin-top:4px; font-weight:600;">Click to view list</div>
        </div>
        <div class="glass-card glass-card--static" style="padding:16px; text-align:center;">
          <div style="font-size:1.8rem; font-weight:700; color:var(--text-primary);">${timeMin}m</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Lab Time</div>
        </div>
      `;

      // Setup click listener for completed card
      document.getElementById('stat-card-completed')?.addEventListener('click', () => {
        const detailsEl = document.getElementById('completed-labs-details');
        if (detailsEl) {
          detailsEl.style.display = detailsEl.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // Populate completed labs details
    const completedLabsListEl = document.getElementById('completed-labs-list');
    const completedLabsCountEl = document.getElementById('completed-labs-count');
    if (completedLabsListEl) {
      const completedIds = studentProgress.filter(p => p.completed).map(p => p.topic_id);
      completedLabsCountEl.textContent = completedIds.length;
      
      if (completedIds.length === 0) {
        completedLabsListEl.innerHTML = '<p style="grid-column: 1/-1; color:var(--text-muted); font-size:0.9rem;">No labs completed yet. Start exploring the curriculum!</p>';
      } else {
        completedLabsListEl.innerHTML = completedIds.map(tid => {
          const topic = getTopicById(tid);
          return `
            <div class="glass-card" style="padding:12px; display:flex; align-items:center; gap:12px; cursor:pointer; border:1px solid var(--border-subtle);"
                 onclick="location.hash='lab?topic=${tid}'">
              <div style="font-size:1.2rem;">🧪</div>
              <div style="overflow:hidden;">
                <div style="font-weight:600; font-size:0.85rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${topic?.name || tid}</div>
                <div style="font-size:0.7rem; color:var(--text-muted);">Form ${topic?.form || '?'}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Recent Quizzes
    const quizzesEl = document.getElementById('recent-quizzes');
    if (quizzesEl) {
      if (studentResults.length === 0) {
        quizzesEl.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">No quizzes taken yet.</p>';
      } else {
        quizzesEl.innerHTML = studentResults.slice(0, 10).map(r => {
          const topic = getTopicById(r.topic_id);
          const scoreColor = r.score >= 80 ? 'var(--accent-emerald)' : r.score >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)';
          const date = new Date(r.created_at).toLocaleDateString('en-HK', { month: 'short', day: 'numeric' });
          return `
            <div style="display:flex; justify-content:space-between; align-items:center;
              padding:10px 0; border-bottom:1px solid var(--border-subtle);">
              <div>
                <div style="font-weight:500; font-size:0.85rem;">${topic?.name || r.topic_id}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${date} · ${r.correct}/${r.total} correct</div>
              </div>
              <div style="font-weight:700; color:${scoreColor}; font-size:0.9rem;">${r.score}%</div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.error('Student data load error:', err);
    const loadingEl = document.getElementById('dashboard-loading');
    if (loadingEl) {
      loadingEl.innerHTML = `
        <p style="color:var(--accent-rose);">⚠️ Failed to load data. Please check your connection.</p>
      `;
    }
  }
}
