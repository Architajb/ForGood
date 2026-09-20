import { getReports, getStats, updateReportStatus } from './data.js';
import { getCategoryConfig, getStatusConfig, timeAgo, showToast } from './ui.js';

export async function renderDashboard() {
  const stats = await getStats();
  const allReports = await getReports(); // authorities see all
  
  // Update stat cards
  document.getElementById('dash-total').textContent = stats.total;
  document.getElementById('dash-reported').textContent = stats.reported;
  document.getElementById('dash-progress').textContent = stats.in_progress;
  document.getElementById('dash-resolved').textContent = stats.resolved;
  
  // Simple CSS bar chart
  const chartContainer = document.getElementById('dash-chart');
  const labelsContainer = document.getElementById('dash-chart-labels');
  
  if (chartContainer && labelsContainer && stats.total > 0) {
    let chartHtml = '';
    let labelsHtml = '';
    
    stats.byCategory.forEach(cat => {
      const percentage = Math.round((cat.count / stats.total) * 100) || 0;
      
      chartHtml += `
        <div class="flex-1 flex flex-col justify-end items-center group relative h-full">
          <div class="w-full rounded-t-sm transition-all duration-300" style="height: ${percentage}%; background-color: ${cat.color}"></div>
          <div class="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transition">${cat.count}</div>
        </div>
      `;
      labelsHtml += `<div class="flex-1 truncate" title="${cat.label}">${cat.label.split(' ')[0]}</div>`;
    });
    
    chartContainer.innerHTML = chartHtml;
    labelsContainer.innerHTML = labelsHtml;
  }
  
  // Update Table
  const tbody = document.getElementById('dash-table-body');
  if (tbody) {
    if (allReports.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">No reports found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = allReports.map(r => {
      const cat = getCategoryConfig(r.type);
      const status = getStatusConfig(r.status);
      
      return `
        <tr class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white" style="background-color: ${cat.hex}">
                <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${cat.label}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">${r.description}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${new Date(r.created_at).toLocaleDateString()}</div>
            <div class="text-xs text-gray-500">${timeAgo(r.created_at)}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${r.user_email}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}">
              ${status.label}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <select class="status-select border-gray-300 rounded-md text-sm shadow-sm focus:ring-primary focus:border-primary" data-id="${r.id}">
              <option value="reported" ${r.status === 'reported' ? 'selected' : ''}>Reported</option>
              <option value="in_progress" ${r.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="resolved" ${r.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
    
    lucide.createIcons({ root: tbody });
    
    // Attach change listeners
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        e.target.disabled = true;
        try {
          await updateReportStatus(id, newStatus);
          showToast("Status updated", "success");
          renderDashboard(); // re-render to update badges/stats
        } catch (error) {
          showToast("Failed to update status", "error");
          e.target.disabled = false;
        }
      });
    });
  }
}
