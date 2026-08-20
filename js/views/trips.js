// views/trips.js — Modul Data Pengiriman (Rit / Trip Log)

import { store, Modal } from "../app.js";
import { openTripDetailModal, openNewTripModal } from "./dashboard.js";

export function renderTripsView(container, queryParams) {
  let searchVal = queryParams ? (queryParams.get("search") || "") : "";
  let dateFilter = "all";
  let statusFilter = "all";
  let truckFilter = "all";
  let sourceFilter = "all";
  let destFilter = "all";

  const getFilteredTrips = () => {
    return store.trips.filter((t) => {
      // Search text
      if (searchVal) {
        const q = searchVal.toLowerCase();
        const matches =
          t.ticketNo.toLowerCase().includes(q) ||
          t.unitNumber.toLowerCase().includes(q) ||
          t.driverName.toLowerCase().includes(q) ||
          t.sourceName.toLowerCase().includes(q) ||
          t.destinationName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Date filter
      if (dateFilter === "today" && t.date !== "2026-08-20") return false;
      if (dateFilter === "yesterday" && t.date !== "2026-08-19") return false;
      if (dateFilter === "older" && (t.date === "2026-08-20" || t.date === "2026-08-19")) return false;
      // Status filter
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      // Truck filter
      if (truckFilter !== "all" && t.truckId !== truckFilter) return false;
      // Source filter
      if (sourceFilter !== "all" && t.sourceId !== sourceFilter) return false;
      // Destination filter
      if (destFilter !== "all" && t.destinationId !== destFilter) return false;

      return true;
    });
  };

  const renderContent = () => {
    const trips = getFilteredTrips();
    const totalVol = trips.reduce((acc, cur) => acc + (cur.volume || 0), 0);

    const truckOptions = store.trucks.map((t) => `<option value="${t.id}">${t.unitNumber}</option>`).join("");
    const sourceOptions = store.sources.map((s) => `<option value="${s.id}">${s.code} - ${s.name.split(" ")[0]}</option>`).join("");
    const destOptions = store.destinations.map((d) => `<option value="${d.id}">${d.code} - ${d.name.split(" ")[0]}</option>`).join("");

    container.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
        <div>
          <h2>Data Pengiriman & Transaksi Ritase (Trip Log)</h2>
          <p class="text-sm text-secondary">Pencatatan real-time surat jalan pengambilan dari quarry dan pengiriman ke lokasi proyek.</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btn-export-csv" class="btn btn-secondary">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button id="btn-add-trip-main" class="btn btn-primary">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Input Rit Baru
          </button>
        </div>
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="card" style="padding: 16px; margin-bottom: 20px;">
        <div class="grid grid-cols-6" style="gap: 12px; align-items: flex-end;">
          <!-- Search -->
          <div class="form-group" style="margin-bottom: 0; grid-column: span 2;">
            <label class="form-label">Pencarian Cepat</label>
            <div class="search-input-wrap">
              <i data-lucide="search" style="width: 14px; height: 14px;"></i>
              <input type="text" id="filter-search" class="form-control" placeholder="No. Tiket / Unit / Driver / Rute..." value="${searchVal}" />
            </div>
          </div>

          <!-- Periode -->
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Tanggal</label>
            <select id="filter-date" class="form-select">
              <option value="all" ${dateFilter === "all" ? "selected" : ""}>Semua Tanggal</option>
              <option value="today" ${dateFilter === "today" ? "selected" : ""}>Hari Ini (20 Ags)</option>
              <option value="yesterday" ${dateFilter === "yesterday" ? "selected" : ""}>Kemarin (19 Ags)</option>
              <option value="older" ${dateFilter === "older" ? "selected" : ""}>18 Ags & Lebih Lama</option>
            </select>
          </div>

          <!-- Unit Truck -->
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Armada Truck</label>
            <select id="filter-truck" class="form-select">
              <option value="all">Semua Unit</option>
              ${truckOptions}
            </select>
          </div>

          <!-- Sumber -->
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Lokasi Sumber</label>
            <select id="filter-source" class="form-select">
              <option value="all">Semua Quarry</option>
              ${sourceOptions}
            </select>
          </div>

          <!-- Status -->
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Status Pengiriman</label>
            <select id="filter-status" class="form-select">
              <option value="all">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="in_transit">Dalam Perjalanan</option>
              <option value="scheduled">Dijadwalkan</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>

        <!-- Filter Metrics Summary -->
        <div class="flex items-center justify-between" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 13px;">
          <span class="text-secondary">Menampilkan <strong>${trips.length}</strong> transaksi dari total ${store.trips.length} rit</span>
          <div class="flex items-center gap-4">
            <span>Total Volume Terfilter: <strong class="text-primary font-semibold">${totalVol.toLocaleString("id-ID")} m³</strong></span>
            <button id="btn-reset-filter" class="btn btn-ghost btn-sm text-accent">Reset Filter</button>
          </div>
        </div>
      </div>

      <!-- Trips Table -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Surat Jalan</th>
                <th>Tanggal & Waktu</th>
                <th>Armada / Driver</th>
                <th>Sumber Tanah (Quarry)</th>
                <th>Tujuan Proyek</th>
                <th>Material</th>
                <th>Volume</th>
                <th>Weighbridge (Netto)</th>
                <th>Status</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="trips-table-body">
              ${renderTripsTableRows(trips)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupTripsEvents(container, renderContent);
  };

  renderContent();
}

function renderTripsTableRows(trips) {
  if (trips.length === 0) {
    return `
      <tr>
        <td colspan="10" class="empty-state">
          <i data-lucide="inbox" class="empty-state-icon"></i>
          <p>Tidak ditemukan data pengiriman dengan kriteria filter tersebut.</p>
        </td>
      </tr>
    `;
  }

  return trips
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
            <div class="font-bold font-mono text-primary">${trip.ticketNo}</div>
            <span class="text-xs text-muted font-mono">${trip.id}</span>
          </td>
          <td>
            <div class="font-medium">${trip.date}</div>
            <div class="text-xs text-muted">${trip.departureTime} &rarr; ${trip.arrivalTime || "..."}</div>
          </td>
          <td>
            <div class="font-semibold text-primary">${trip.unitNumber}</div>
            <div class="text-xs text-secondary">${trip.driverName}</div>
          </td>
          <td>
            <div class="font-medium text-primary">${trip.sourceName}</div>
          </td>
          <td>
            <div class="font-medium text-primary">${trip.destinationName}</div>
          </td>
          <td>
            <span class="text-xs font-medium text-secondary">${trip.soilType}</span>
          </td>
          <td>
            <span class="font-bold text-primary">${trip.volume} m³</span>
          </td>
          <td>
            <div class="text-sm font-semibold">${trip.netWeight > 0 ? `${trip.netWeight.toLocaleString("id-ID")} kg` : "-"}</div>
          </td>
          <td>${statusBadge}</td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm btn-trip-detail-view" data-trip-id="${trip.id}">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function setupTripsEvents(container, renderContent) {
  if (window.lucide) window.lucide.createIcons();

  // Search input
  const searchEl = document.getElementById("filter-search");
  if (searchEl) {
    searchEl.addEventListener("input", (e) => {
      // quick update
      const filtered = store.trips.filter((t) => {
        const q = e.target.value.toLowerCase();
        return (
          t.ticketNo.toLowerCase().includes(q) ||
          t.unitNumber.toLowerCase().includes(q) ||
          t.driverName.toLowerCase().includes(q) ||
          t.sourceName.toLowerCase().includes(q) ||
          t.destinationName.toLowerCase().includes(q)
        );
      });
      document.getElementById("trips-table-body").innerHTML = renderTripsTableRows(filtered);
      if (window.lucide) window.lucide.createIcons();
      bindDetailBtns();
    });
  }

  // Export CSV
  const exportBtn = document.getElementById("btn-export-csv");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => store.exportTripsToCSV());
  }

  // Add Trip
  const addTripBtn = document.getElementById("btn-add-trip-main");
  if (addTripBtn) {
    addTripBtn.addEventListener("click", () => {
      openNewTripModal();
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById("btn-reset-filter");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("filter-search").value = "";
      document.getElementById("filter-date").value = "all";
      document.getElementById("filter-truck").value = "all";
      document.getElementById("filter-source").value = "all";
      document.getElementById("filter-status").value = "all";
      document.getElementById("trips-table-body").innerHTML = renderTripsTableRows(store.trips);
      if (window.lucide) window.lucide.createIcons();
      bindDetailBtns();
    });
  }

  // Dropdown filter changes
  ["filter-date", "filter-truck", "filter-source", "filter-status"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", () => {
        const dateVal = document.getElementById("filter-date").value;
        const truckVal = document.getElementById("filter-truck").value;
        const sourceVal = document.getElementById("filter-source").value;
        const statusVal = document.getElementById("filter-status").value;

        const filtered = store.trips.filter((t) => {
          if (dateVal === "today" && t.date !== "2026-08-20") return false;
          if (dateVal === "yesterday" && t.date !== "2026-08-19") return false;
          if (dateVal === "older" && (t.date === "2026-08-20" || t.date === "2026-08-19")) return false;
          if (statusVal !== "all" && t.status !== statusVal) return false;
          if (truckVal !== "all" && t.truckId !== truckVal) return false;
          if (sourceVal !== "all" && t.sourceId !== sourceVal) return false;
          return true;
        });

        document.getElementById("trips-table-body").innerHTML = renderTripsTableRows(filtered);
        if (window.lucide) window.lucide.createIcons();
        bindDetailBtns();
      });
    }
  });

  bindDetailBtns();
}

function bindDetailBtns() {
  document.querySelectorAll(".btn-trip-detail-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tripId = btn.getAttribute("data-trip-id");
      const trip = store.trips.find((t) => t.id === tripId);
      if (trip) openTripDetailModal(trip);
    });
  });
}
