// ═══════════════════════════════════════════════
// Navbar Component (with Auth)
// ═══════════════════════════════════════════════

import { signOut } from '../services/supabase.js';

const navLinks = [
  { id: 'home', label: '🏠 Home', hash: '#home' },
  { id: 'curriculum', label: '📚 Curriculum', hash: '#curriculum' },
  { id: 'lab', label: '🔬 Lab', hash: '#lab' },
  { id: 'assessment', label: '✅ Assessment', hash: '#assessment' },
  { id: 'dashboard', label: '📊 Dashboard', hash: '#dashboard' }
];

export function renderNavbar(activePage, profile) {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const username = profile?.username || profile?.full_name || 'User';
  const role = profile?.role || 'student';
  const isAdmin = role === 'admin';

  nav.innerHTML = `
    <nav class="navbar">
      <a href="#home" class="navbar__brand">
        🧪 <span>ChemLab HK</span>
      </a>
      <div class="navbar__links">
        ${navLinks.map(link => `
          <a href="${link.hash}" class="navbar__link ${activePage === link.id ? 'active' : ''}">
            ${link.label}
          </a>
        `).join('')}
      </div>
      <div class="navbar__user" style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:0.8rem; color:var(--text-secondary);">
          ${isAdmin ? '👨‍🏫' : '🧑‍🔬'} ${username}
        </span>
        <button class="btn btn--ghost btn--sm" id="logout-btn" style="font-size:0.75rem; padding:4px 10px;">
          Logout
        </button>
      </div>
    </nav>
  `;

  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await signOut();
    window.location.hash = '';
    window.location.reload();
  });
}
