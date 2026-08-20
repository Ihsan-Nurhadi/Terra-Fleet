// views/dashboard.js — Main Fleet Monitoring Dashboard

import { store, Modal } from "../app.js";
import { createLineTrendChart, createDoughnutDistributionChart, createBarDestinationChart } from "../charts.js";

export function renderDashboardView(container) {
  const kpis = store.getKPIs();

  // Status color helper for achievement %
  const getAchieveColor = (pct) => {
    if (pct >= 100) return "success";
    if (pct >= 70) return "warning";
    return "danger";
  };

  container.innerHTML = `
    <!-- Top KPI Cards Grid -->
    <div class="grid grid-cols-6" style="margin-bottom: 24px;">
      <!-- Total Truck -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-label">Armada Truck</span>
          <div class="kpi-icon-wrap">
            <i data-lucide="truck" style="width: 18px; height: 18px;"></i>
          </div>
        </div>
        <div class="kpi-value">${kpis.totalTrucks} <span class="text-xs font-medium text-secondary">Unit</span></div>
        <div class="kpi-subtext">
          <span class="badge badge-success" style="padding: 2px 6px; font-size: 11px;">
            <span class="badge-dot"></span>${kpis.activeTrucks} Aktif
          </span>
          <span class="badge badge-neutral" style="padding: 2px 6px; font-size: 11px;">
            ${kpis.idleTrucks} Idle
          </span>
          <span class="badge badge-danger" style="padding: 2px 6px; font-size: 11px;">
            ${kpis.maintTrucks} Servis
          </span>
        </div>
      </div>

      <!-- Total Driver -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-label">Driver Bertugas</span>
          <div class="kpi-icon-wrap">
            <i data-lucide="users" style="width: 18px; height: 18px;"></i>
          </div>
        </div>
        <div class="kpi-value">${kpis.totalDrivers} <span class="text-xs font-medium text-secondary">Orang</span></div>
        <div class="kpi-subtext">
          <span class="text-success font-medium">${kpis.onDutyDrivers} On-Duty</span>
          <span>• ${kpis.totalDrivers - kpis.onDutyDrivers} Standby/Off</span>
        </div>
      </div>

      <!-- Total Rit Hari Ini -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-label">Ritase Hari Ini</span>
          <div class="kpi-icon-wrap">
            <i data-lucide="repeat" style="width: 18px; height: 18px;"></i>
          </div>
        </div>
        <div class="kpi-value">${kpis.todayTripsCount} <span class="text-xs font-medium text-secondary">Rit</span></div>
        <div class="kpi-subtext">
          <span class="text-success font-medium">${kpis.todayCompletedTripsCount} Selesai</span>
          <span>• ${kpis.todayTripsCount - kpis.todayCompletedTripsCount} Berjalan/Jadwal</span>
        </div>
      </div>

      <!-- Volume Hari Ini -->
      <div class="kpi-card">
        <div class="kpi-card-header">
          <span class="kpi-label">Volume Terkirim (Hari Ini)</span>
          <div class="kpi-icon-wrap">
            <i data-lucide="layers" style="width: 18px; height: 18px;"></i>
          </div>
        </div>
        <div class="kpi-value">${kpis.todayVolume.toLocaleString("id-ID")} <span class="text-xs font-medium text-secondary">m³</span></div>
        <div class="kpi-subtext">
          <span>Target harian: <strong>${kpis.dailyTargetVolume} m³</strong></span>
        </div>
      </div>

      <!-- Target Achievement % -->
      <div class="kpi-card" style="grid-column: span 2;">
        <div class="kpi-card-header">
          <span class="kpi-label">Pencapaian Target Hari Ini</span>
          <div class="kpi-icon-wrap">
            <i data-lucide="target" style="width: 18px; height: 18px;"></i>
          </div>
        </div>
        <div class="flex items-center justify-between" style="margin-bottom: 8px;">
          <div class="kpi-value" style="margin-bottom: 0;">${kpis.achievementPct}%</div>
          <span class="badge badge-${getAchieveColor(kpis.achievementPct)}">
            ${kpis.achievementPct >= 100 ? "Mencapai Target" : kpis.achievementPct >= 70 ? "On Track" : "Perlu Percepatan"}
          </span>
        </div>
        <div class="progress-track" style="height: 8px; margin-top: 4px;">
          <div class="progress-fill ${getAchieveColor(kpis.achievementPct)}" style="width: ${Math.min(kpis.achievementPct, 100)}%;"></div>
        </div>
      </div>
    </div>

    <!-- Live Fleet GPS Quick Tracker Banner -->
    <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary)); border-left: 4px solid var(--accent-primary);">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-primary-subtle); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="map-pinned" style="width: 22px; height: 22px;"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-primary" style="font-size: 15px;">Live GPS Fleet Tracking Map</h4>
              <span class="badge badge-success" style="font-size: 11px;">
                <span class="pulse-dot" style="width: 6px; height: 6px;"></span> 3 Unit Sedang Melintas
              </span>
            </div>
            <p class="text-xs text-secondary" style="margin-top: 2px;">
              Pantau rute DT-03, DT-04, dan DT-08 dari quarry ke lokasi proyek dengan estimasi waktu tiba (ETA) dan kecepatan aktual.
            </p>
          </div>
        </div>
        <a href="#/map" class="btn btn-primary btn-sm">
          <i data-lucide="map" style="width: 14px; height: 14px;"></i> Buka Peta Interaktif &rarr;
        </a>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-3" style="margin-bottom: 24px;">
      <!-- Line Chart: Tren Pengiriman -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="trending-up" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Tren Pengiriman & Ritase (3 Hari Terakhir)
            </h3>
            <p class="card-subtitle">Volume tanah terangkut (m³) vs frekuensi ritase armada per hari</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge badge-accent">Live Analytics</span>
          </div>
        </div>
        <div style="position: relative; height: 260px; width: 100%;">
          <canvas id="chart-dashboard-trend"></canvas>
        </div>
      </div>

      <!-- Doughnut Chart: Distribusi Sumber Galian -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="pie-chart" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Distribusi per Sumber
            </h3>
            <p class="card-subtitle">Kontribusi volume extraction per quarry</p>
          </div>
        </div>
        <div style="position: relative; height: 260px; width: 100%;">
          <canvas id="chart-dashboard-sources"></canvas>
        </div>
      </div>
    </div>

    <!-- Tables Row: Summary per Truck & Live Status -->
    <div class="grid grid-cols-3" style="margin-bottom: 24px;">
      <!-- Summary Table per Truck -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="activity" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Performa Operasional per Unit Truck
            </h3>
            <p class="card-subtitle">Pemantauan rit, volume terangkut, dan rasio pencapaian target harian</p>
          </div>
          <a href="#/trucks" class="btn btn-secondary btn-sm">
            Lihat Semua Unit <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Unit</th>
                <th>Driver Aktif</th>
                <th>Kapasitas</th>
                <th>Status</th>
                <th>Rit Hari Ini</th>
                <th>Volume (m³)</th>
                <th style="min-width: 140px;">Pencapaian Target</th>
              </tr>
            </thead>
            <tbody>
              ${renderTruckSummaryRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bar Chart: Penerimaan per Tujuan Proyek -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="map-pin" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Volume per Lokasi Tujuan
            </h3>
            <p class="card-subtitle">Realisasi vs target volume proyek</p>
          </div>
        </div>
        <div style="position: relative; height: 260px; width: 100%;">
          <canvas id="chart-dashboard-destinations"></canvas>
        </div>
      </div>
    </div>

    <!-- Quick Live Trip Stream -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <i data-lucide="clock" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
            Aktivitas Pengiriman Terbaru (Real-time Log)
          </h3>
          <p class="card-subtitle">Transaksi ritase terbaru yang terdaftar di sistem</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-quick-new-trip" class="btn btn-primary btn-sm">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Input Rit Baru
          </button>
          <a href="#/trips" class="btn btn-secondary btn-sm">
            Buka Riwayat Lengkap <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Tiket / Surat Jalan</th>
              <th>Waktu</th>
              <th>Unit & Driver</th>
              <th>Rute (Sumber &rarr; Tujuan)</th>
              <th>Material</th>
              <th>Volume</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${renderRecentTripRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Initialize Charts
  setTimeout(() => {
    initDashboardCharts();
    setupDashboardEventListeners();
  }, 50);
}

function renderTruckSummaryRows() {
  const trucks = store.trucks;
  const todayTrips = store.trips.filter((t) => t.date === "2026-08-20");

  return trucks
    .map((truck) => {
      const driver = store.drivers.find((d) => d.id === truck.currentDriverId);
      const truckTodayTrips = todayTrips.filter((t) => t.truckId === truck.id && t.status === "completed");
      const todayVol = truckTodayTrips.reduce((acc, cur) => acc + (cur.volume || 0), 0);
      
      const targetObj = store.targets.daily.find((t) => t.category === "truck" && t.entityId === truck.id);
      const targetVol = targetObj ? targetObj.targetVolume : truck.capacity * 3;
      const pct = targetVol > 0 ? Math.min(Math.round((todayVol / targetVol) * 100), 150) : 0;
      
      let statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Aktif</span>`;
      if (truck.status === "idle") {
        statusBadge = `<span class="badge badge-neutral"><span class="badge-dot"></span>Idle</span>`;
      } else if (truck.status === "maintenance") {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Maintenance</span>`;
      }

      let fillClass = "danger";
      if (pct >= 100) fillClass = "success";
      else if (pct >= 70) fillClass = "warning";

      return `
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <div class="font-semibold text-primary">${truck.unitNumber}</div>
              <span class="text-xs text-muted">(${truck.licensePlate})</span>
            </div>
          </td>
          <td>
            <div class="text-sm font-medium">${driver ? driver.name : "<span class='text-muted'>-</span>"}</div>
            <div class="text-xs text-muted">${truck.shift}</div>
          </td>
          <td><span class="font-medium">${truck.capacity} m³</span></td>
          <td>${statusBadge}</td>
          <td><span class="font-semibold">${truckTodayTrips.length} Rit</span></td>
          <td><span class="font-semibold text-primary">${todayVol} m³</span></td>
          <td>
            <div class="progress-container">
              <div class="progress-track">
                <div class="progress-fill ${fillClass}" style="width: ${Math.min(pct, 100)}%;"></div>
              </div>
              <span class="progress-label text-${fillClass}">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderRecentTripRows() {
  const recentTrips = store.trips.slice(0, 6);

  return recentTrips
    .map((trip) => {
      let statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Selesai</span>`;
      if (trip.status === "in_transit") {
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span>Dalam Perjalanan</span>`;
      } else if (trip.status === "scheduled") {
        statusBadge = `<span class="badge badge-neutral"><span class="badge-dot"></span>Dijadwalkan</span>`;
      } else if (trip.status === "cancelled") {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Dibatalkan</span>`;
      }

      return `
        <tr>
          <td>
            <span class="font-semibold text-primary" style="font-family: var(--font-mono);">${trip.ticketNo}</span>
          </td>
          <td>
            <div class="text-sm">${trip.departureTime} WIB</div>
            <div class="text-xs text-muted">${trip.date}</div>
          </td>
          <td>
            <div class="font-medium">${trip.unitNumber}</div>
            <div class="text-xs text-muted">${trip.driverName}</div>
          </td>
          <td>
            <div class="text-sm font-medium text-primary">${trip.sourceName}</div>
            <div class="text-xs text-muted">&rarr; ${trip.destinationName}</div>
          </td>
          <td>
            <span class="text-xs font-medium text-secondary">${trip.soilType}</span>
          </td>
          <td>
            <span class="font-semibold">${trip.volume} m³</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-secondary btn-sm btn-trip-detail" data-trip-id="${trip.id}">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Detail
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function initDashboardCharts() {
  // 1. Line Trend Chart (Volume & Rit per hari)
  const labels = ["18 Agustus 2026", "19 Agustus 2026", "20 Agustus 2026 (Hari ini)"];
  const volumeData = [224, 268, 142]; // dummy volume trends
  const tripsData = [10, 12, 7];

  createLineTrendChart("chart-dashboard-trend", labels, tripsData, volumeData);

  // 2. Sources Doughnut Chart
  const sourceLabels = store.sources.map((s) => s.name.replace("Quarry ", "").replace("Tambang ", ""));
  const sourceData = store.sources.map((s) => s.totalVolumeExtracted);
  createDoughnutDistributionChart("chart-dashboard-sources", sourceLabels, sourceData);

  // 3. Destinations Bar Chart
  const destLabels = store.destinations.map((d) => d.code);
  const destReceived = store.destinations.map((d) => d.currentVolumeReceived);
  const destTarget = store.destinations.map((d) => d.targetVolume);
  createBarDestinationChart("chart-dashboard-destinations", destLabels, destReceived, destTarget);
}

function setupDashboardEventListeners() {
  // Quick New Trip Button
  const btnNewTrip = document.getElementById("btn-quick-new-trip");
  if (btnNewTrip) {
    btnNewTrip.addEventListener("click", () => {
      openNewTripModal();
    });
  }

  // Detail buttons on trip rows
  document.querySelectorAll(".btn-trip-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tripId = btn.getAttribute("data-trip-id");
      const trip = store.trips.find((t) => t.id === tripId);
      if (trip) {
        openTripDetailModal(trip);
      }
    });
  });
}

export function openTripDetailModal(trip) {
  const modalBody = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
        <div class="flex items-center justify-between" style="margin-bottom: 12px;">
          <div>
            <span class="text-xs text-muted uppercase font-semibold">Nomor Surat Jalan</span>
            <h4 style="font-family: var(--font-mono); font-size: 18px; color: var(--accent-primary);">${trip.ticketNo}</h4>
          </div>
          <span class="badge badge-${trip.status === "completed" ? "success" : trip.status === "in_transit" ? "warning" : "neutral"}">
            ${trip.status === "completed" ? "Selesai" : trip.status === "in_transit" ? "Dalam Perjalanan" : trip.status}
          </span>
        </div>
        <div class="grid grid-cols-2" style="gap: 12px; font-size: 13px;">
          <div><span class="text-muted">Tanggal:</span> <strong>${trip.date}</strong></div>
          <div><span class="text-muted">Waktu Berangkat:</span> <strong>${trip.departureTime} WIB</strong></div>
          <div><span class="text-muted">Waktu Tiba:</span> <strong>${trip.arrivalTime || "Sedang Berjalan"}</strong></div>
          <div><span class="text-muted">Petugas Penerima:</span> <strong>${trip.receivedBy || "-"}</strong></div>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 16px;">
        <!-- Info Unit & Driver -->
        <div class="card" style="padding: 16px;">
          <h5 style="margin-bottom: 10px; font-size: 14px; font-weight: 600;">Unit & Driver</h5>
          <p style="font-size: 13px; margin-bottom: 4px;"><strong class="text-primary">${trip.unitNumber}</strong></p>
          <p style="font-size: 13px; margin-bottom: 4px;">Driver: <strong class="text-primary">${trip.driverName}</strong></p>
          <p style="font-size: 13px;">Volume: <strong class="text-primary">${trip.volume} m³</strong></p>
        </div>

        <!-- Info Timbangan -->
        <div class="card" style="padding: 16px;">
          <h5 style="margin-bottom: 10px; font-size: 14px; font-weight: 600;">Data Timbangan (Weighbridge)</h5>
          <p style="font-size: 13px; margin-bottom: 4px;">Bruto: <strong>${trip.grossWeight.toLocaleString("id-ID")} kg</strong></p>
          <p style="font-size: 13px; margin-bottom: 4px;">Tara: <strong>${trip.tareWeight.toLocaleString("id-ID")} kg</strong></p>
          <p style="font-size: 13px;">Netto: <strong class="text-success">${trip.netWeight.toLocaleString("id-ID")} kg</strong></p>
        </div>
      </div>

      <!-- Rute Detail -->
      <div class="card" style="padding: 16px;">
        <h5 style="margin-bottom: 10px; font-size: 14px; font-weight: 600;">Rute Pengangkutan</h5>
        <div class="flex items-center gap-3" style="margin-bottom: 8px;">
          <span class="badge badge-accent">Sumber</span>
          <span class="text-sm font-medium text-primary">${trip.sourceName}</span>
        </div>
        <div class="flex items-center gap-3" style="margin-bottom: 8px;">
          <span class="badge badge-neutral">Tujuan</span>
          <span class="text-sm font-medium text-primary">${trip.destinationName}</span>
        </div>
        <p class="text-xs text-muted" style="margin-top: 8px;">Jenis Material: <strong>${trip.soilType}</strong></p>
        <p class="text-xs text-muted">Catatan Operasional: "${trip.notes || "-"}"</p>
      </div>

      <!-- Mock Bukti Foto Muatan -->
      <div>
        <h5 style="margin-bottom: 8px; font-size: 14px; font-weight: 600;">Dokumentasi & Bukti Muatan Lapangan</h5>
        <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); height: 180px; position: relative;">
          <img src="${trip.photoUrl || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'}" alt="Bukti Muatan" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-family: var(--font-mono);">
            GPS: -6.5412, 106.8921 | Verified at ${trip.departureTime} WIB
          </div>
        </div>
      </div>
    </div>
  `;

  const modalFooter = `
    <button class="btn btn-secondary btn-sm" onclick="window.print()">
      <i data-lucide="printer" style="width: 14px; height: 14px;"></i> Cetak Surat Jalan
    </button>
    <button class="btn btn-primary btn-sm" data-close-modal>Tutup</button>
  `;

  Modal.open(`Detail Transaksi Ritase — ${trip.ticketNo}`, modalBody, modalFooter);

  // Bind close buttons in modal
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}

export function openNewTripModal() {
  const truckOptions = store.trucks
    .filter((t) => t.status === "active")
    .map((t) => `<option value="${t.id}">${t.unitNumber} (${t.licensePlate}) — Kapasitas ${t.capacity} m³</option>`)
    .join("");

  const driverOptions = store.drivers
    .map((d) => `<option value="${d.id}">${d.name} (${d.shift})</option>`)
    .join("");

  const sourceOptions = store.sources
    .map((s) => `<option value="${s.id}">${s.name} (${s.code})</option>`)
    .join("");

  const destinationOptions = store.destinations
    .map((d) => `<option value="${d.id}">${d.name} (${d.code})</option>`)
    .join("");

  const modalBody = `
    <form id="form-new-trip">
      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Pilih Unit Dump Truck *</label>
          <select id="input-trip-truck" class="form-select" required>
            ${truckOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Pilih Driver *</label>
          <select id="input-trip-driver" class="form-select" required>
            ${driverOptions}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Lokasi Sumber (Quarry) *</label>
          <select id="input-trip-source" class="form-select" required>
            ${sourceOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Lokasi Tujuan Proyek *</label>
          <select id="input-trip-destination" class="form-select" required>
            ${destinationOptions}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Volume Muatan (m³) *</label>
          <input type="number" id="input-trip-volume" class="form-control" value="20" min="5" max="40" required />
        </div>
        <div class="form-group">
          <label class="form-label">Jam Berangkat</label>
          <input type="time" id="input-trip-time" class="form-control" value="13:30" required />
        </div>
        <div class="form-group">
          <label class="form-label">Status Rit</label>
          <select id="input-trip-status" class="form-select">
            <option value="completed">Selesai (Completed)</option>
            <option value="in_transit">Dalam Perjalanan</option>
            <option value="scheduled">Dijadwalkan</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Berat Bruto (kg)</label>
          <input type="number" id="input-trip-gross" class="form-control" value="34500" />
        </div>
        <div class="form-group">
          <label class="form-label">Berat Tara (kg)</label>
          <input type="number" id="input-trip-tare" class="form-control" value="14500" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Penerima / Checker di Lokasi</label>
        <input type="text" id="input-trip-receiver" class="form-control" placeholder="Contoh: Pak Sardi (Checker Lapangan)" value="Pak Sardi (Checker Lapangan)" />
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Tambahan</label>
        <input type="text" id="input-trip-notes" class="form-control" placeholder="Catatan pengurugan / kondisi jalan..." value="Pengiriman reguler sesuai jadwal target." />
      </div>
    </form>
  `;

  const modalFooter = `
    <button class="btn btn-secondary btn-sm" data-close-modal>Batal</button>
    <button id="btn-submit-new-trip" class="btn btn-primary btn-sm">
      <i data-lucide="check" style="width: 14px; height: 14px;"></i> Simpan & Terbitkan Rit
    </button>
  `;

  Modal.open("Input Transaksi Ritase Baru", modalBody, modalFooter);

  // Setup form submission
  document.getElementById("btn-submit-new-trip").addEventListener("click", () => {
    const truckId = document.getElementById("input-trip-truck").value;
    const driverId = document.getElementById("input-trip-driver").value;
    const sourceId = document.getElementById("input-trip-source").value;
    const destinationId = document.getElementById("input-trip-destination").value;
    const volume = document.getElementById("input-trip-volume").value;
    const departureTime = document.getElementById("input-trip-time").value;
    const status = document.getElementById("input-trip-status").value;
    const grossWeight = document.getElementById("input-trip-gross").value;
    const tareWeight = document.getElementById("input-trip-tare").value;
    const receivedBy = document.getElementById("input-trip-receiver").value;
    const notes = document.getElementById("input-trip-notes").value;

    store.addTrip({
      truckId,
      driverId,
      sourceId,
      destinationId,
      volume,
      departureTime,
      status,
      grossWeight,
      tareWeight,
      receivedBy,
      notes
    });

    Modal.close();
    // Re-render current page
    renderDashboardView(document.getElementById("main-content-view"));
  });

  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
