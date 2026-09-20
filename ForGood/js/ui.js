import { CONFIG } from './config.js';

/**
 * Show a toast notification
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-lg shadow-lg text-white font-medium text-sm transform transition-all duration-300 translate-y-full opacity-0 flex items-center gap-2`;
  
  let bgColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-resolved';
      icon = 'check-circle';
      break;
    case 'error':
      bgColor = 'bg-alert';
      icon = 'alert-circle';
      break;
    default:
      bgColor = 'bg-primary';
      icon = 'info';
  }
  
  toast.classList.add(bgColor);
  toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  lucide.createIcons({ root: toast });
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-full', 'opacity-0');
  }, 10);
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function renderNavbars(user) {
  const isAuthority = user && user.role === 'authority';
  
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = `
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <a href="#/home" class="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                  <i data-lucide="heart-handshake" class="text-marigold"></i> ForGood
                </a>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#/home" class="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-target="home">Home</a>
                <a href="#/map" class="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-target="map">Live Map</a>
                <a href="#/report" class="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-target="report">Report Issue</a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-4">
                <div class="flex-col items-end hidden sm:flex">
                  <span class="text-sm font-medium text-gray-900">${user.email}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full ${isAuthority ? 'bg-alert' : 'bg-primary'} text-white font-bold">${isAuthority ? 'Authority' : 'Citizen'}</span>
                </div>
                ${!isAuthority ? `<a href="#/my-reports" class="text-sm text-gray-600 hover:text-gray-900">My Reports</a>` : ''}
                ${isAuthority ? `<a href="#/dashboard" class="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>` : ''}
                <button id="btn-logout-desktop" class="text-sm text-alert hover:text-red-800 font-medium">Log out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  const bottomNavContainer = document.getElementById('bottom-nav-container');
  if (bottomNavContainer) {
    bottomNavContainer.innerHTML = `
      <div class="sm:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-40 flex justify-around py-2 px-1 pb-safe">
        <a href="#/home" class="flex flex-col items-center p-2 text-gray-500 hover:text-primary">
          <i data-lucide="home" class="w-6 h-6"></i>
          <span class="text-[10px] mt-1">Home</span>
        </a>
        <a href="#/map" class="flex flex-col items-center p-2 text-gray-500 hover:text-primary">
          <i data-lucide="map" class="w-6 h-6"></i>
          <span class="text-[10px] mt-1">Map</span>
        </a>
        <a href="#/report" class="flex flex-col items-center p-2 text-primary">
          <div class="bg-primary text-white rounded-full p-2 -mt-6 shadow-lg border-4 border-cream">
            <i data-lucide="plus" class="w-6 h-6"></i>
          </div>
          <span class="text-[10px] mt-1 font-bold">Report</span>
        </a>
        ${!isAuthority ? `
        <a href="#/my-reports" class="flex flex-col items-center p-2 text-gray-500 hover:text-primary">
          <i data-lucide="file-text" class="w-6 h-6"></i>
          <span class="text-[10px] mt-1">Reports</span>
        </a>
        ` : ''}
        ${isAuthority ? `
        <a href="#/dashboard" class="flex flex-col items-center p-2 text-gray-500 hover:text-primary">
          <i data-lucide="layout-dashboard" class="w-6 h-6"></i>
          <span class="text-[10px] mt-1">Dash</span>
        </a>
        ` : ''}
        <button id="btn-logout-mobile" class="flex flex-col items-center p-2 text-alert hover:text-red-800">
          <i data-lucide="log-out" class="w-6 h-6"></i>
          <span class="text-[10px] mt-1 font-medium">Log out</span>
        </button>
      </div>
    `;
  }
  
  lucide.createIcons();
  
  // Attach logout listeners
  const handleLogout = async () => {
    const { logout } = await import('./auth.js');
    await logout();
  };
  
  document.getElementById('btn-logout-desktop')?.addEventListener('click', handleLogout);
  document.getElementById('btn-logout-mobile')?.addEventListener('click', handleLogout);
}

export function removeNavbars() {
  const navContainer = document.getElementById('nav-container');
  if (navContainer) navContainer.innerHTML = '';
  
  const bottomNavContainer = document.getElementById('bottom-nav-container');
  if (bottomNavContainer) bottomNavContainer.innerHTML = '';
}

/**
 * Switch active section
 * @param {string} viewId 
 */
export function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.add('active');
  } else {
    document.getElementById('view-home').classList.add('active');
  }
  
  // Update desktop nav
  document.querySelectorAll('.nav-link').forEach(el => {
    if (el.dataset.target === viewId) {
      el.classList.add('border-primary', 'text-gray-900');
      el.classList.remove('border-transparent', 'text-gray-500');
    } else {
      el.classList.remove('border-primary', 'text-gray-900');
      el.classList.add('border-transparent', 'text-gray-500');
    }
  });

  // Re-render icons since they might have been hidden
  lucide.createIcons();
}

/**
 * Populate standard category dropdowns
 */
export function populateDropdowns() {
  const typeFilter = document.getElementById('filter-type');
  const reportType = document.getElementById('report-type');
  
  if (!typeFilter || !reportType) return;
  
  // Clear first
  reportType.innerHTML = '<option value="" disabled selected>Select an issue type...</option>';
  typeFilter.innerHTML = '<option value="all">All Categories</option>';
  
  CONFIG.CATEGORIES.forEach(cat => {
    const optFilter = document.createElement('option');
    optFilter.value = cat.id;
    optFilter.textContent = cat.label;
    typeFilter.appendChild(optFilter);
    
    const optReport = document.createElement('option');
    optReport.value = cat.id;
    optReport.textContent = cat.label;
    reportType.appendChild(optReport);
  });
}

/**
 * Format date relatively
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

export function getCategoryConfig(id) {
  return CONFIG.CATEGORIES.find(c => c.id === id) || CONFIG.CATEGORIES[CONFIG.CATEGORIES.length - 1];
}

export function getStatusConfig(id) {
  return CONFIG.STATUSES.find(s => s.id === id) || CONFIG.STATUSES[0];
}
