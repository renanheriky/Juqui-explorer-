/* leaflet-init.js - inicialização do mapa Leaflet (incluir via <script> somente nas páginas com map)
   Usa a CDN do Leaflet; cria marcadores de exemplo com popups.
*/
// leaflet-init.js
function initLeafletMap(containerId, items){
  // Wait until L is available
  if(typeof L === 'undefined') {
    console.error('Leaflet não carregado.');
    return;
  }
  const map = L.map(containerId, { scrollWheelZoom: false }).setView([-23.71, -46.885], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // items: [{title, coords, desc, url}]
  items.forEach(it=>{
    const m = L.marker(it.coords).addTo(map);
    const popupHtml = `<strong>${it.title}</strong><div style="font-size:13px;color:#444">${it.desc || ''}</div><div style="margin-top:6px"><a href="${it.url}" class="btn" style="text-decoration:none">Ver</a></div>`;
    m.bindPopup(popupHtml);
  });

  return map;
}
