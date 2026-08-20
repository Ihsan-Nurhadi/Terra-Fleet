// views/map.js — Interactive Live Fleet GPS Monitoring Map

import { store } from "../app.js";
import { getTheme, onThemeChange } from "../theme.js";

let leafletMap = null;
let tileLayer = null;
let markersGroup = null;
let routesGroup = null;
let simulationInterval = null;

// Mock GPS Coordinates for Quarries & Destinations
const LOCATIONS = {
  sources: [
    { id: "SRC-01", name: "Quarry Bukit Hambalang", coords: [-6.5412, 106.8921], code: "HMB-01" },
    { id: "SRC-02", name: "Galian C Rumpin Indah", coords: [-6.4218, 106.6341], code: "RMP-02" },
    { id: "SRC-03", name: "Tambang Cileungsi", coords: [-6.3982, 106.981], code: "CLS-03" },
    { id: "SRC-04", name: "Quarry Parung Panjang", coords: [-6.3541, 106.5812], code: "PRP-04" }
  ],
  destinations: [
    { id: "DST-01", name: "Proyek Tol Cisumdawu", coords: [-6.8621, 107.9142], code: "CSM-03" },
    { id: "DST-02", name: "KI Cikarang", coords: [-6.321, 107.174], code: "KIC-02" },
    { id: "DST-03", name: "Grand Serpong", coords: [-6.3015, 106.6628], code: "GSR-01" },
    { id: "DST-04", name: "Logistik Marunda", coords: [-6.1082, 106.9745], code: "MRD-04" }
  ]
};

// Initial in-transit trucks with intermediate GPS positions & routes
const LIVE_TRUCKS = [
  {
    truckId: "TRK-03",
    unitNumber: "DT-03",
    driverName: "Supriadi",
    speed: 52, // km/h
    heading: "Grand Serpong",
    sourceName: "Galian C Rumpin Indah",
    destinationName: "Pembangunan Residensial Grand Serpong",
    volume: 24,
    status: "in_transit",
    progress: 0.65, // 65% of route
    eta: "14 menit",
    currentCoords: [-6.345, 106.648],
    route: [
      [-6.4218, 106.6341],
      [-6.392, 106.641],
      [-6.365, 106.645],
      [-6.345, 106.648],
      [-6.325, 106.655],
      [-6.3015, 106.6628]
    ]
  },
  {
    truckId: "TRK-04",
    unitNumber: "DT-04",
    driverName: "Rahmat Hidayat",
    speed: 48,
    heading: "Logistik Marunda",
    sourceName: "Quarry Bukit Hambalang",
    destinationName: "Reklamasi Logistik Marunda",
    volume: 20,
    status: "in_transit",
    progress: 0.42,
    eta: "28 menit",
    currentCoords: [-6.385, 106.915],
    route: [
      [-6.5412, 106.8921],
      [-6.482, 106.899],
      [-6.415, 106.908],
      [-6.385, 106.915],
      [-6.285, 106.945],
      [-6.185, 106.962],
      [-6.1082, 106.9745]
    ]
  },
  {
    truckId: "TRK-08",
    unitNumber: "DT-08",
    driverName: "Teguh Santoso",
    speed: 58,
    heading: "Tol Cisumdawu",
    sourceName: "Quarry Parung Panjang",
    destinationName: "Proyek Tol Cisumdawu Seksi 3",
    volume: 24,
    status: "in_transit",
    progress: 0.35,
    eta: "45 menit",
    currentCoords: [-6.495, 107.025],
    route: [
      [-6.3541, 106.5812],
      [-6.412, 106.72],
      [-6.495, 107.025],
      [-6.62, 107.38],
      [-6.75, 107.65],
      [-6.8621, 107.9142]
    ]
  },
  {
    truckId: "TRK-01",
    unitNumber: "DT-01",
    driverName: "Bambang Sutrisno",
    speed: 0,
    heading: "Quarry Bukit Hambalang (Loading)",
    sourceName: "Quarry Bukit Hambalang",
    destinationName: "Proyek Tol Cisumdawu",
    volume: 20,
    status: "loading",
    progress: 0,
    eta: "Antrian Muat",
    currentCoords: [-6.5412, 106.8921],
    route: []
  },
  {
    truckId: "TRK-02",
    unitNumber: "DT-02",
    driverName: "Dedi Kurniawan",
    speed: 0,
    heading: "KI Cikarang (Unloading)",
    sourceName: "Quarry Bukit Hambalang",
    destinationName: "Penimbunan KI Cikarang",
    volume: 22,
    status: "unloading",
    progress: 1,
    eta: "Bongkar Selesai",
    currentCoords: [-6.321, 107.174],
    route: []
  }
];

export function renderLiveMapView(container) {
  // Clear any ongoing simulation timer
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 16px;">
      <div>
        <h2>Peta Pemantauan Armada Real-Time (Live GPS Fleet Tracking)</h2>
        <p class="text-sm text-secondary">Monitoring posisi, kecepatan, rute pergerakan, dan estimasi waktu tiba (ETA) dump truck secara interaktif.</p>
      </div>
      <div class="flex items-center gap-3">
        <button id="btn-fit-map-bounds" class="btn btn-secondary btn-sm">
          <i data-lucide="maximize" style="width: 14px; height: 14px;"></i> Reset Tampilan Peta
        </button>
        <button id="btn-toggle-sim" class="btn btn-primary btn-sm">
          <i data-lucide="play" style="width: 14px; height: 14px;"></i> <span id="sim-btn-text">Simulasi Pergerakan GPS</span>
        </button>
      </div>
    </div>

    <!-- Map Layout Container -->
    <div class="map-view-container">
      <!-- Leaflet Map Canvas -->
      <div class="map-viewport-card">
        <div id="fleet-leaflet-map"></div>

        <!-- Floating Map Legend -->
        <div class="map-legend-overlay">
          <span class="font-semibold text-primary" style="margin-bottom: 2px;">Keterangan Marker:</span>
          <div class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #16A34A; border: 1px solid #fff;"></span>
            <span>Truk Sedang Jalan (In-Transit)</span>
          </div>
          <div class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #D97706; border: 1px solid #fff;"></span>
            <span>Lokasi Quarry / Sumber</span>
          </div>
          <div class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #2563EB; border: 1px solid #fff;"></span>
            <span>Lokasi Proyek Tujuan</span>
          </div>
        </div>
      </div>

      <!-- Side Control Panel -->
      <aside class="map-side-panel">
        <div class="card" style="padding: 14px;">
          <div class="flex items-center justify-between" style="margin-bottom: 10px;">
            <span class="text-xs font-semibold uppercase text-secondary">Armada Sedang Melintas</span>
            <span class="badge badge-success" style="font-size: 11px;">
              <span class="pulse-dot" style="width: 6px; height: 6px;"></span> 3 In-Transit
            </span>
          </div>
          <p class="text-xs text-muted">Klik salah satu unit truk untuk mengarahkan kamera peta ke posisi GPS aktual.</p>
        </div>

        <!-- Truck List -->
        <div class="map-truck-list" id="map-truck-list-container">
          ${renderTruckListCards()}
        </div>
      </aside>
    </div>
  `;

  setTimeout(() => {
    initLeafletMap();
    setupMapEventListeners(container);
    if (window.lucide) window.lucide.createIcons();
  }, 50);
}

function renderTruckListCards() {
  return LIVE_TRUCKS.map((truck) => {
    let statusPill = `<span class="badge badge-success" style="font-size: 10px; padding: 2px 6px;">In Transit (${truck.speed} km/h)</span>`;
    if (truck.status === "loading") {
      statusPill = `<span class="badge badge-warning" style="font-size: 10px; padding: 2px 6px;">Muat Material</span>`;
    } else if (truck.status === "unloading") {
      statusPill = `<span class="badge badge-neutral" style="font-size: 10px; padding: 2px 6px;">Bongkar Muatan</span>`;
    }

    return `
      <div class="map-truck-item" data-truck-id="${truck.truckId}">
        <div class="flex items-center justify-between" style="margin-bottom: 6px;">
          <div class="flex items-center gap-2">
            <strong class="text-primary font-mono" style="font-size: 14px;">${truck.unitNumber}</strong>
            <span class="text-xs text-muted">(${truck.volume} m³)</span>
          </div>
          ${statusPill}
        </div>

        <div class="text-xs text-secondary" style="margin-bottom: 4px;">
          Driver: <strong class="text-primary">${truck.driverName}</strong>
        </div>

        <div style="font-size: 11px; background: var(--bg-secondary); padding: 6px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 6px;">
          <div class="truncate text-muted">Dari: <strong>${truck.sourceName}</strong></div>
          <div class="truncate text-muted">Ke: <strong class="text-primary">${truck.destinationName}</strong></div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-muted">Estimasi Tiba:</span>
          <strong class="text-accent font-semibold">${truck.eta}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function getMapTileUrl() {
  const isDark = getTheme() === "dark";
  return isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
}

function initLeafletMap() {
  if (!window.L) return;

  const mapContainer = document.getElementById("fleet-leaflet-map");
  if (!mapContainer) return;

  // Destroy previous instance if exists
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Initial Center: Jabodetabek - Jawa Barat corridor
  leafletMap = window.L.map("fleet-leaflet-map", {
    zoomControl: true,
    attributionControl: false
  }).setView([-6.48, 107.0], 10);

  // Add CartoDB Tile Layer
  tileLayer = window.L.tileLayer(getMapTileUrl(), {
    maxZoom: 18,
    subdomains: "abcd"
  }).addTo(leafletMap);

  markersGroup = window.L.layerGroup().addTo(leafletMap);
  routesGroup = window.L.layerGroup().addTo(leafletMap);

  drawMapMarkersAndRoutes();

  // Listen to theme changes to dynamically switch map tiles
  onThemeChange(() => {
    if (tileLayer && leafletMap) {
      tileLayer.setUrl(getMapTileUrl());
    }
  });
}

function drawMapMarkersAndRoutes() {
  if (!markersGroup || !routesGroup || !window.L) return;

  markersGroup.clearLayers();
  routesGroup.clearLayers();

  const bounds = [];

  // 1. Draw Quarry Markers (Orange)
  LOCATIONS.sources.forEach((src) => {
    bounds.push(src.coords);
    const quarryIcon = window.L.divIcon({
      className: "custom-map-pin-wrap",
      html: `
        <div class="custom-map-pin quarry" style="width: 32px; height: 32px;">
          <span class="pin-label">${src.code}</span>
          <span style="font-size: 14px;">⛰️</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const popupContent = `
      <div class="map-popup-header">
        <span class="map-popup-title">${src.name}</span>
        <span class="badge badge-warning">Quarry</span>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary);">
        <p>Kode: <strong>${src.code}</strong></p>
        <p>Koordinat: <span style="font-family: var(--font-mono); font-size: 11px;">${src.coords.join(", ")}</span></p>
        <p style="margin-top: 4px;">Status: <strong class="text-success">Aktif Ekstraksi</strong></p>
      </div>
    `;

    window.L.marker(src.coords, { icon: quarryIcon })
      .bindPopup(popupContent)
      .addTo(markersGroup);
  });

  // 2. Draw Destination Markers (Blue)
  LOCATIONS.destinations.forEach((dest) => {
    bounds.push(dest.coords);
    const destIcon = window.L.divIcon({
      className: "custom-map-pin-wrap",
      html: `
        <div class="custom-map-pin destination" style="width: 32px; height: 32px;">
          <span class="pin-label">${dest.code}</span>
          <span style="font-size: 14px;">🏗️</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const popupContent = `
      <div class="map-popup-header">
        <span class="map-popup-title">${dest.name}</span>
        <span class="badge badge-accent">Proyek</span>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary);">
        <p>Kode: <strong>${dest.code}</strong></p>
        <p>Koordinat: <span style="font-family: var(--font-mono); font-size: 11px;">${dest.coords.join(", ")}</span></p>
        <p style="margin-top: 4px;">Status: <strong class="text-warning">In Progress</strong></p>
      </div>
    `;

    window.L.marker(dest.coords, { icon: destIcon })
      .bindPopup(popupContent)
      .addTo(markersGroup);
  });

  // 3. Draw Polylines & Live Truck Markers
  LIVE_TRUCKS.forEach((truck) => {
    if (truck.route && truck.route.length > 1) {
      // Draw Polyline
      window.L.polyline(truck.route, {
        color: "#3B82F6",
        weight: 3.5,
        opacity: 0.65,
        dashArray: "6, 6"
      }).addTo(routesGroup);
    }

    bounds.push(truck.currentCoords);

    const truckIcon = window.L.divIcon({
      className: "custom-map-pin-wrap",
      html: `
        <div class="custom-map-pin truck" style="width: 34px; height: 34px;">
          <span class="pin-label">${truck.unitNumber} (${truck.speed} km/h)</span>
          <span style="font-size: 16px;">🚛</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const popupContent = `
      <div class="map-popup-header">
        <span class="map-popup-title">${truck.unitNumber} &mdash; ${truck.driverName}</span>
        <span class="badge badge-success">${truck.status}</span>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
        <p>Kecepatan: <strong class="text-primary">${truck.speed} km/jam</strong></p>
        <p>Muatan: <strong>${truck.volume} m³ Tanah Urug</strong></p>
        <p>Rute: <strong>${truck.sourceName.split(" ")[0]} &rarr; ${truck.destinationName.split(" ")[0]}</strong></p>
        <p>Estimasi Tiba: <strong class="text-accent">${truck.eta}</strong></p>
      </div>
    `;

    truck.markerRef = window.L.marker(truck.currentCoords, { icon: truckIcon })
      .bindPopup(popupContent)
      .addTo(markersGroup);
  });

  // Fit view bounds smoothly
  if (bounds.length > 0) {
    leafletMap.fitBounds(bounds, { padding: [40, 40] });
  }
}

function setupMapEventListeners(container) {
  // Fit Map Bounds Button
  const btnFit = document.getElementById("btn-fit-map-bounds");
  if (btnFit) {
    btnFit.addEventListener("click", () => {
      if (leafletMap) {
        drawMapMarkersAndRoutes();
      }
    });
  }

  // Click on Truck List Item to Focus
  container.querySelectorAll(".map-truck-item").forEach((item) => {
    item.addEventListener("click", () => {
      container.querySelectorAll(".map-truck-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const truckId = item.getAttribute("data-truck-id");
      const truck = LIVE_TRUCKS.find((t) => t.truckId === truckId);

      if (truck && leafletMap) {
        leafletMap.flyTo(truck.currentCoords, 13, { duration: 1.2 });
        if (truck.markerRef) {
          setTimeout(() => truck.markerRef.openPopup(), 1200);
        }
      }
    });
  });

  // GPS Movement Simulation Toggle
  const btnSim = document.getElementById("btn-toggle-sim");
  const simText = document.getElementById("sim-btn-text");

  let isSimulating = false;

  if (btnSim) {
    btnSim.addEventListener("click", () => {
      isSimulating = !isSimulating;

      if (isSimulating) {
        btnSim.classList.remove("btn-primary");
        btnSim.classList.add("btn-secondary");
        simText.textContent = "Hentikan Simulasi GPS";
        store.showToast("Simulasi pergerakan GPS armada diaktifkan!", "success");

        simulationInterval = setInterval(() => {
          // Advance in-transit trucks
          LIVE_TRUCKS.filter((t) => t.status === "in_transit").forEach((truck) => {
            // Jiggle coordinates along route
            truck.currentCoords = [
              truck.currentCoords[0] + (Math.random() - 0.48) * 0.002,
              truck.currentCoords[1] + (Math.random() - 0.48) * 0.002
            ];
            truck.speed = Math.floor(45 + Math.random() * 15);
          });

          drawMapMarkersAndRoutes();
        }, 2000);
      } else {
        clearInterval(simulationInterval);
        simulationInterval = null;
        btnSim.classList.add("btn-primary");
        btnSim.classList.remove("btn-secondary");
        simText.textContent = "Simulasi Pergerakan GPS";
        store.showToast("Simulasi pergerakan GPS dihentikan.", "warning");
      }
    });
  }
}
