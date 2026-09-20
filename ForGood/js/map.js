import { getReports } from './data.js';
import { getCategoryConfig, getStatusConfig, timeAgo } from './ui.js';
import { detectHotspots } from './hotspots.js';

let mapInstance = null;
let markersLayer = null;
let hotspotsLayer = null;
let currentFilters = { type: 'all', status: 'all' };

export function setupMap(containerId) {
  if (mapInstance) return;
  
  // Default to Tamil Nadu, India
  mapInstance = L.map(containerId).setView([11.1271, 78.6569], 7);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapInstance);
  
  markersLayer = L.layerGroup().addTo(mapInstance);
  hotspotsLayer = L.layerGroup().addTo(mapInstance);
  
  // Filter Listeners
  document.getElementById('filter-type')?.addEventListener('change', (e) => {
    currentFilters.type = e.target.value;
    updateMapData();
  });
  
  document.getElementById('filter-status')?.addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    updateMapData();
  });
}

export function invalidateMapSize() {
  if (mapInstance) {
    mapInstance.invalidateSize();
  }
}

export async function updateMapData() {
  if (!mapInstance) return;
  
  const reports = await getReports(currentFilters);
  
  markersLayer.clearLayers();
  hotspotsLayer.clearLayers();
  
  // Draw Hotspots first so they are under markers
  const allUnfilteredReports = await getReports(); // hotspots usually based on all data
  const hotspots = detectHotspots(allUnfilteredReports);
  
  // Render Hotspot Circles
  hotspots.forEach(hs => {
    // Only show if it matches current type filter, or type is all
    if (currentFilters.type !== 'all' && currentFilters.type !== hs.type) return;
    
    L.circle([hs.lat, hs.lng], {
      radius: 500, // 500m
      className: 'hotspot-circle'
    }).addTo(hotspotsLayer);
  });
  
  // Render Hotspots List in Sidebar
  updateHotspotsList(hotspots);
  
  // Render Markers
  reports.forEach(r => {
    const cat = getCategoryConfig(r.type);
    const status = getStatusConfig(r.status);
    
    const isResolved = r.status === 'resolved';
    
    // Custom HTML icon
    const iconHtml = `<div class="custom-marker ${isResolved ? 'marker-resolved' : 'marker-' + cat.id}"><i data-lucide="${cat.icon}"></i></div>`;
    
    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
    
    const marker = L.marker([r.lat, r.lng], { icon }).addTo(markersLayer);
    
    // Popup content
    const popupContent = `
      <div class="min-w-[200px]">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-0.5 rounded-full ${status.color}">${status.label}</span>
          <span class="text-xs text-gray-500 font-medium">${timeAgo(r.created_at)}</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">${cat.label}</h4>
        <p class="text-sm text-gray-700 mb-3">${r.description}</p>
        <div class="text-[10px] text-gray-500 border-t border-gray-100 pt-2">Reported by: ${r.user_email || 'Anonymous'}</div>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    marker.on('popupopen', () => {
      lucide.createIcons();
    });
  });
  
  lucide.createIcons();
  updateStatsCounters(reports, hotspots.length);
}

function updateHotspotsList(hotspots) {
  const container = document.getElementById('hotspots-list');
  if (!container) return;
  
  if (hotspots.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-500 italic" id="no-hotspots">No hotspots detected currently.</p>';
    return;
  }
  
  container.innerHTML = hotspots.map(hs => {
    const cat = getCategoryConfig(hs.type);
    return `
      <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-100 transition" onclick="window.panToHotspot(${hs.lat}, ${hs.lng})">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-white bg-alert scale-75">
            <i data-lucide="flame" class="w-4 h-4"></i>
          </div>
          <span class="font-bold text-sm text-gray-900">${cat.label}</span>
        </div>
        <p class="text-xs text-gray-600 font-medium">${hs.count} Active Reports within 500m</p>
      </div>
    `;
  }).join('');
  
  // Make panToHotspot global for inline onclick
  window.panToHotspot = (lat, lng) => {
    if (mapInstance) mapInstance.setView([lat, lng], 15);
  };
}

function updateStatsCounters(reports, hotspotsCount) {
  const elActive = document.getElementById('stat-active');
  const elHotspots = document.getElementById('stat-hotspots');
  const elResolved = document.getElementById('stat-resolved');
  
  if (elActive) elActive.textContent = reports.filter(r => r.status !== 'resolved').length;
  if (elHotspots) elHotspots.textContent = hotspotsCount;
  if (elResolved) elResolved.textContent = reports.filter(r => r.status === 'resolved').length;
}
