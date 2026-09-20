import { switchView, populateDropdowns, showToast, renderNavbars, removeNavbars } from './ui.js';
import { getCurrentUser, login, signUp, logout, initAuth } from './auth.js';
import { setupMap, invalidateMapSize, updateMapData } from './map.js';
import { initReportForm, handleReportSubmit } from './report.js';
import { renderDashboard } from './dashboard.js';
import { renderMyReports } from './myreports.js';

// Setup Router
async function handleRoute() {
  const hash = window.location.hash || '';
  const path = hash.replace('#/', '');
  
  const user = getCurrentUser();
  
  if (!user) {
    if (path !== 'login') {
      window.location.hash = '#/login';
      return;
    }
    removeNavbars();
    switchView('login');
    return;
  }
  
  // User is logged in
  if (path === 'login' || path === '') {
    window.location.hash = '#/home';
    return;
  }
  
  renderNavbars(user);
  
  // Guard authority routes
  const isAuthority = user.role === 'authority';
  if (path === 'dashboard' && !isAuthority) {
    showToast('Authority access required.', 'error');
    window.location.hash = '#/home';
    return;
  }
  
  switchView(path);
  
  // Route specific initialization
  if (path === 'map') {
    setTimeout(() => {
      invalidateMapSize();
      updateMapData(); 
    }, 100);
  } else if (path === 'report') {
    setTimeout(() => {
      initReportForm();
    }, 100);
  } else if (path === 'dashboard') {
    renderDashboard();
  } else if (path === 'my-reports') {
    renderMyReports();
  }
}

// App Initialization
async function initApp() {
  console.log('Initializing ForGood App...');
  
  // Show loader initially
  const loader = document.getElementById('app-loader');
  if (loader) loader.style.display = 'flex';
  
  // Init auth and fetch session
  await initAuth();
  
  if (loader) loader.style.display = 'none';
  
  populateDropdowns();
  setupMap('map');
  
  window.addEventListener('hashchange', handleRoute);
  
  // Auth Listeners for Login/Signup Form
  const loginForm = document.getElementById('login-form');
  const btnToggleAuth = document.getElementById('btn-toggle-auth');
  const signupFields = document.getElementById('signup-fields');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  
  let isSignupMode = false;
  
  if (btnToggleAuth) {
    btnToggleAuth.addEventListener('click', () => {
      isSignupMode = !isSignupMode;
      if (isSignupMode) {
        signupFields.classList.remove('hidden');
        btnSubmitLogin.innerHTML = '<i data-lucide="user-plus"></i> <span>Sign Up</span>';
        btnToggleAuth.textContent = 'Log In';
        document.getElementById('auth-mode-text').textContent = 'Already have an account?';
        document.getElementById('signup-name').required = true;
      } else {
        signupFields.classList.add('hidden');
        btnSubmitLogin.innerHTML = '<i data-lucide="log-in"></i> <span>Log In</span>';
        btnToggleAuth.textContent = 'Sign Up';
        document.getElementById('auth-mode-text').textContent = 'New here? Sign up and choose Citizen or Authority to explore both views.';
        document.getElementById('signup-name').required = false;
      }
      lucide.createIcons({ root: btnSubmitLogin });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      btnSubmitLogin.disabled = true;
      const originalText = btnSubmitLogin.innerHTML;
      btnSubmitLogin.innerHTML = `<i data-lucide="loader" class="animate-spin w-5 h-5"></i> <span>${isSignupMode ? 'Signing up...' : 'Logging in...'}</span>`;
      lucide.createIcons({ root: btnSubmitLogin });
      
      try {
        if (isSignupMode) {
          const name = document.getElementById('signup-name').value;
          const role = document.querySelector('input[name="signup-role"]:checked').value;
          await signUp(email, password, name, role);
          showToast('Signed up successfully! Check your email if confirmation is required.', 'success');
        } else {
          await login(email, password);
          showToast('Logged in successfully', 'success');
        }
      } catch (err) {
        showToast(err.message || 'Authentication failed', 'error');
      } finally {
        btnSubmitLogin.disabled = false;
        btnSubmitLogin.innerHTML = originalText;
        lucide.createIcons({ root: btnSubmitLogin });
      }
    });
  }
  
  document.getElementById('report-form')?.addEventListener('submit', handleReportSubmit);
  
  document.getElementById('btn-refresh-dashboard')?.addEventListener('click', () => {
    renderDashboard();
    showToast('Dashboard refreshed');
  });

  // Trigger initial route
  handleRoute();
}

document.addEventListener('DOMContentLoaded', initApp);
