// ═══════════════════════════════════════════════
// Auth Page — Login / Signup
// ═══════════════════════════════════════════════

import { signUp, signIn } from '../services/supabase.js';

let isSignup = false;
let authError = '';
let authLoading = false;

export function renderAuth() {
  return `
    <section class="section" style="max-width:480px; margin:0 auto; padding-top:80px;">
      <div class="glass-card glass-card--static" style="padding:40px;">
        <div style="text-align:center; margin-bottom:32px;">
          <div style="font-size:3rem; margin-bottom:12px;">🧪</div>
          <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:4px;">ChemLab HK</h2>
          <p style="color:var(--text-secondary); font-size:0.9rem;">
            ${isSignup ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        ${authError ? `
          <div style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.2);
            border-radius:var(--radius-sm); padding:12px; margin-bottom:20px;
            color:var(--accent-rose); font-size:0.85rem;">
            ⚠️ ${authError}
          </div>
        ` : ''}

        <form id="auth-form" style="display:flex; flex-direction:column; gap:16px;">
          ${isSignup ? `
            <div>
              <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
                Username *
              </label>
              <input class="input" type="text" id="auth-username" placeholder="e.g. student_hk01"
                required minlength="3" maxlength="30" pattern="[a-zA-Z0-9_]+"
                title="Letters, numbers, and underscores only" autocomplete="username" />
            </div>
            <div>
              <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
                Full Name
              </label>
              <input class="input" type="text" id="auth-fullname" placeholder="e.g. Chan Tai Man"
                autocomplete="name" />
            </div>
          ` : ''}

          <div>
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
              Email *
            </label>
            <input class="input" type="email" id="auth-email" placeholder="student@school.hk"
              required autocomplete="email" />
          </div>

          <div>
            <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
              Password *
            </label>
            <input class="input" type="password" id="auth-password" placeholder="Min 6 characters"
              required minlength="6" autocomplete="${isSignup ? 'new-password' : 'current-password'}" />
          </div>

          ${isSignup ? `
            <div>
              <label style="font-size:0.85rem; color:var(--text-secondary); display:block; margin-bottom:6px;">
                Form (for Students)
              </label>
              <select class="input" id="auth-form-select" style="cursor:pointer;">
                <option value="1">Form 1</option>
                <option value="2">Form 2</option>
                <option value="3">Form 3</option>
              </select>
            </div>
          ` : ''}

          <button class="btn btn--primary btn--lg" type="submit" id="auth-submit-btn"
            style="width:100%; margin-top:8px;" ${authLoading ? 'disabled' : ''}>
            ${authLoading ? '⏳ Please wait...' : (isSignup ? '🚀 Create Account' : '🔑 Sign In')}
          </button>
        </form>

        <div style="text-align:center; margin-top:24px;">
          <p style="color:var(--text-muted); font-size:0.85rem;">
            ${isSignup ? 'Already have an account?' : "Don't have an account?"}
            <a href="#" id="auth-toggle-btn" style="color:var(--accent-primary); text-decoration:none; font-weight:600;">
              ${isSignup ? 'Sign In' : 'Sign Up'}
            </a>
          </p>
        </div>
      </div>
    </section>
  `;
}

export function initAuthEvents(onSuccess) {
  const form = document.getElementById('auth-form');
  const toggleBtn = document.getElementById('auth-toggle-btn');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isSignup = !isSignup;
      authError = '';
      // Re-render
      const main = document.getElementById('main-content');
      main.innerHTML = renderAuth();
      initAuthEvents(onSuccess);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      authError = '';
      authLoading = true;

      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Please wait...';
      }

      const email = document.getElementById('auth-email')?.value?.trim();
      const password = document.getElementById('auth-password')?.value;

      try {
        if (isSignup) {
          const username = document.getElementById('auth-username')?.value?.trim();
          const fullName = document.getElementById('auth-fullname')?.value?.trim() || '';
          const role = 'student'; // Force student role for public signups
          const formNum = parseInt(document.getElementById('auth-form-select')?.value || '1');

          if (!username) {
            throw new Error('Username is required');
          }

          const { data, error } = await signUp({ email, password, username, fullName, role, form: formNum });
          if (error) throw error;

          // If session is immediately available (auto-confirm enabled), trigger success
          if (data?.session && onSuccess) {
            onSuccess(data.user);
            return;
          }

          // Show success message for signup (if email confirmation is required)
          authError = '';
          const main = document.getElementById('main-content');
          main.innerHTML = `
            <section class="section" style="max-width:480px; margin:0 auto; padding-top:80px;">
              <div class="glass-card glass-card--static" style="padding:40px; text-align:center;">
                <div style="font-size:3rem; margin-bottom:12px;">✅</div>
                <h2 style="font-size:1.3rem; font-weight:700; margin-bottom:8px;">Check Your Email</h2>
                <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:24px;">
                  We've sent a confirmation link to <strong>${email}</strong>.
                  Please confirm your email to start using ChemLab HK.
                </p>
                <button class="btn btn--primary" id="go-login-btn">Back to Login</button>
              </div>
            </section>
          `;
          document.getElementById('go-login-btn')?.addEventListener('click', () => {
            isSignup = false;
            const main2 = document.getElementById('main-content');
            main2.innerHTML = renderAuth();
            initAuthEvents(onSuccess);
          });
        } else {
          const { data, error } = await signIn({ email, password });
          if (error) throw error;
          if (data?.user && onSuccess) {
            onSuccess(data.user);
          }
        }
      } catch (err) {
        authError = err.message || 'Something went wrong. Please try again.';
        authLoading = false;
        const main = document.getElementById('main-content');
        main.innerHTML = renderAuth();
        initAuthEvents(onSuccess);
      }
    });
  }
}

export function resetAuthState() {
  isSignup = false;
  authError = '';
  authLoading = false;
}
