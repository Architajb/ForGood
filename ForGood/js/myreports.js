import { getReports } from './data.js';
import { getCurrentUser } from './auth.js';
import { getCategoryConfig, getStatusConfig, timeAgo } from './ui.js';

export async function renderMyReports() {
  const user = getCurrentUser();
  if (!user) return;
  
  const container = document.getElementById('my-reports-list');
  if (!container) return;
  
  container.innerHTML = '<div class="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100"><i data-lucide="loader" class="animate-spin w-8 h-8 mx-auto mb-2 text-primary"></i> Loading...</div>';
  lucide.createIcons({ root: container });
  
  try {
    const reports = await getReports({ userId: user.id });
    
    if (reports.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 flex flex-col items-center">
          <div class="w-16 h-16 bg-cream text-primary rounded-full flex items-center justify-center mb-4">
            <i data-lucide="file-text" class="w-8 h-8"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">You haven't reported any issues yet.</h3>
          <p class="text-gray-500 mb-6">Help your community by reporting issues you see around you.</p>
          <a href="#/report" class="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:brightness-90 transition">Report an Issue</a>
        </div>
      `;
      lucide.createIcons({ root: container });
      return;
    }
    
    container.innerHTML = reports.map(r => {
      const cat = getCategoryConfig(r.type);
      const status = getStatusConfig(r.status);
      
      return `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white" style="background-color: ${cat.hex}">
                <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">${cat.label}</h4>
                <p class="text-xs text-gray-500">${timeAgo(r.created_at)}</p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-semibold rounded-full ${status.color}">${status.label}</span>
          </div>
          <p class="text-gray-700 text-sm mb-4 line-clamp-3">${r.description}</p>
          <div class="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 p-2 rounded border border-gray-100">
            <i data-lucide="map-pin" class="w-3 h-3"></i> ${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}
          </div>
        </div>
      `;
    }).join('');
    
    lucide.createIcons({ root: container });
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div class="col-span-full py-12 text-center text-alert">Failed to load reports.</div>';
  }
}
