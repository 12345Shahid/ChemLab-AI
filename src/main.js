// ═══════════════════════════════════════════════
// Main Entry — Router & App Init (with Auth)
// ═══════════════════════════════════════════════

import './style.css';
import { renderNavbar } from './components/navbar.js';
import { renderChatbot, initChatbotQuickQuestions } from './components/chatbot.js';
import { renderHome } from './pages/home.js';
import { renderCurriculum, initCurriculumEvents } from './pages/curriculum.js';
import { renderLab, initLabEvents, cleanupLab } from './pages/lab.js';
import { renderAssessment, initAssessmentEvents, resetAssessment } from './pages/assessment.js';
import { renderDashboard, initDashboardEvents } from './pages/dashboard.js';
import { renderAuth, initAuthEvents, resetAuthState } from './pages/auth.js';
import { getCurrentUser, getProfile, onAuthStateChange, supabase } from './services/supabase.js';

// ─── App State ───
let currentUser = null;
let currentProfile = null;

// ─── Initialize ───

async function init() {
  // Check existing auth session
  const user = await getCurrentUser();

  if (user) {
    currentUser = user;
    currentProfile = await getProfile(user.id);
    startApp();
  } else {
    showAuth();
  }

  // Listen for auth changes
  onAuthStateChange(async (event, session) => {
    console.log('[Auth] State Change:', event, session?.user?.id);
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      if (currentUser?.id === session.user.id && currentProfile) return; // Already loaded
      
      currentUser = session.user;
      currentProfile = await getProfile(session.user.id);
      startApp();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      showAuth();
    }
  });
}

function showAuth() {
  // Hide navbar when not logged in
  const nav = document.getElementById('navbar');
  if (nav) nav.innerHTML = '';
  const chatEl = document.getElementById('chatbot');
  if (chatEl) chatEl.innerHTML = '';

  const main = document.getElementById('main-content');
  main.innerHTML = renderAuth();
  initAuthEvents(async (user) => {
    // Proactive login on success
    currentUser = user;
    currentProfile = await getProfile(user.id);
    startApp();
  });
}

function startApp() {
  // Make profile globally accessible
  window.__chemlabProfile = currentProfile;
  window.__chemlabUser = currentUser;

  // Listen for hash changes
  window.removeEventListener('hashchange', handleRoute);
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  // Render chatbot (persistent across pages)
  renderChatbot();
  initChatbotQuickQuestions();
}

// ─── Router ───

function handleRoute() {
  if (!currentUser) {
    showAuth();
    return;
  }

  const hash = window.location.hash.slice(1) || 'home';
  const [page, queryStr] = hash.split('?');
  const params = parseQuery(queryStr);

  // Cleanup previous page
  cleanupLab();

  // Render navbar with user info
  renderNavbar(page, currentProfile);

  // Render page content
  const main = document.getElementById('main-content');

  switch (page) {
    case 'home':
      resetAssessment();
      main.innerHTML = renderHome();
      break;

    case 'curriculum':
      resetAssessment();
      main.innerHTML = renderCurriculum(params);
      initCurriculumEvents();
      break;

    case 'lab':
      resetAssessment();
      main.innerHTML = renderLab(params);
      initLabEvents();
      break;

    case 'assessment':
      main.innerHTML = renderAssessment(params);
      initAssessmentEvents();
      break;

    case 'dashboard':
      resetAssessment();
      main.innerHTML = renderDashboard(params, currentProfile);
      initDashboardEvents();
      break;

    case 'auth':
      showAuth();
      return;

    default:
      main.innerHTML = renderHome();
      break;
  }

  // Re-render chatbot (updates topic context)
  renderChatbot();

  // Scroll to top on page change
  window.scrollTo(0, 0);
}

function parseQuery(queryStr) {
  if (!queryStr) return {};
  const params = {};
  queryStr.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
}

// ─── Start ───
document.addEventListener('DOMContentLoaded', init);
