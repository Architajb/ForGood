/**
 * Haversine formula to calculate distance in meters between two lat/lng coordinates
 */
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
}

/**
 * Detect hotspots: 3+ unresolved reports of the SAME category within 500 meters
 * Returns an array of hotspot objects { lat, lng, type, count, reports }
 */
export function detectHotspots(reports) {
  const unresolved = reports.filter(r => r.status !== 'resolved');
  
  // Group by category first
  const byType = {};
  unresolved.forEach(r => {
    if (!byType[r.type]) byType[r.type] = [];
    byType[r.type].push(r);
  });
  
  const hotspots = [];
  
  for (const [type, typeReports] of Object.entries(byType)) {
    // Simple clustering logic (O(n^2) but fine for prototype)
    const processed = new Set();
    
    for (let i = 0; i < typeReports.length; i++) {
      if (processed.has(typeReports[i].id)) continue;
      
      const cluster = [typeReports[i]];
      
      for (let j = 0; j < typeReports.length; j++) {
        if (i === j || processed.has(typeReports[j].id)) continue;
        
        const dist = getDistance(
          typeReports[i].lat, typeReports[i].lng,
          typeReports[j].lat, typeReports[j].lng
        );
        
        if (dist <= 500) { // 500 meters radius
          cluster.push(typeReports[j]);
        }
      }
      
      if (cluster.length >= 3) {
        // We have a hotspot
        // Calculate center point
        let sumLat = 0, sumLng = 0;
        cluster.forEach(r => {
          sumLat += r.lat;
          sumLng += r.lng;
          processed.add(r.id);
        });
        
        hotspots.push({
          type: type,
          lat: sumLat / cluster.length,
          lng: sumLng / cluster.length,
          count: cluster.length,
          reports: cluster
        });
      }
    }
  }
  
  return hotspots;
}
