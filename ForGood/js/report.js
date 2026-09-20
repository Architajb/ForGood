import { createReport } from './data.js';
import { showToast } from './ui.js';

let reportMap = null;
let reportMarker = null;

export function initReportForm() {
  if (reportMap) {
    reportMap.invalidateSize();
    return;
  }
  
  // Default to Tamil Nadu, India
  reportMap = L.map('report-map').setView([11.1271, 78.6569], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(reportMap);
  
  reportMap.on('click', (e) => {
    setReportLocation(e.latlng.lat, e.latlng.lng);
  });
  
  document.getElementById('btn-use-location')?.addEventListener('click', () => {
    if (navigator.geolocation) {
      document.getElementById('location-status').textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setReportLocation(pos.coords.latitude, pos.coords.longitude);
          reportMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
          document.getElementById('location-status').textContent = "Location found!";
        },
        () => {
          document.getElementById('location-status').textContent = "Could not get location. Click the map instead.";
          showToast("Geolocation failed", "error");
        }
      );
    }
  });
}

function setReportLocation(lat, lng) {
  if (reportMarker) {
    reportMarker.setLatLng([lat, lng]);
  } else {
    reportMarker = L.marker([lat, lng]).addTo(reportMap);
  }
  document.getElementById('report-lat').value = lat;
  document.getElementById('report-lng').value = lng;
}

export async function handleReportSubmit(e) {
  e.preventDefault();
  
  const type = document.getElementById('report-type').value;
  const description = document.getElementById('report-description').value;
  const lat = document.getElementById('report-lat').value;
  const lng = document.getElementById('report-lng').value;
  
  if (!lat || !lng) {
    showToast("Please select a location on the map", "error");
    return;
  }
  
  const submitBtn = document.getElementById('btn-submit-report');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-5 h-5"></i> Submitting...';
  lucide.createIcons({ root: submitBtn });
  
  try {
    await createReport({
      type,
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });
    
    showToast("Report submitted successfully!", "success");
    e.target.reset();
    if (reportMarker) {
      reportMarker.remove();
      reportMarker = null;
    }
    
    // Redirect to map to see it
    window.location.hash = '#/map';
  } catch (error) {
    console.error(error);
    showToast(error.message || "Failed to submit report", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Report</span>';
  }
}
