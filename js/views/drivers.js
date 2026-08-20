// views/drivers.js — Driver Monitoring & Performance Module

import { store, Modal } from "../app.js";

export function renderDriversView(container) {
  let activeShiftFilter = "all";

  const renderContent = () => {
    const filteredDrivers = store.drivers.filter((driver) => {
      if (activeShiftFilter === "all") return true;
      if (activeShiftFilter === "on_duty") return driver.status === "on_duty";
      if (activeShiftFilter === "standby") return driver.status === "standby";
      if (activeShiftFilter === "off_duty") return driver.status === "off_duty";
      return true;
    });

    const onDutyCount = store.drivers.filter((d) => d.status === "on_duty").length;
    const standbyCount = store.drivers.filter((d) => d.status === "standby").length;
    const offDutyCount = store.drivers.filter((d) => d.status === "off_duty").length;

    container.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
        <div>
          <h2>Monitoring Driver & Shift Armada</h2>
          <p class="text-sm text-secondary">Pemantauan histori jam kerja, performa ritase, safety score, dan penugasan unit truck.</p>
        </div>
      </div>

      <!-- Quick KPI Strip -->
      <div class="grid grid-cols-4" style="margin-bottom: 20px;">
        <div class="kpi-card" style="padding: 16px;">
          <div class="kpi-label">Total Pengemudi</div>
          <div class="kpi-value text-lg">${store.drivers.length} <span class="text-xs text-muted">Personel</span></div>
        </div>
        <div class="kpi-card" style="padding: 16px;">
          <div class="kpi-label">Driver On-Duty</div>
          <div class="kpi-value text-lg text-success">${onDutyCount} <span class="text-xs text-muted">Aktif Jalan</span></div>
        </div>
        <div class="kpi-card" style="padding: 16px;">
          <div class="kpi-label">Driver Standby</div>
          <div class="kpi-value text-lg text-warning">${standbyCount} <span class="text-xs text-muted">Pool / Cadangan</span></div>
        </div>
        <div class="kpi-card" style="padding: 16px;">
          <div class="kpi-label">Rata-Rata Safety Score</div>
          <div class="kpi-value text-lg text-accent">96.4 <span class="text-xs text-muted">/ 100</span></div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <button class="btn btn-sm ${activeShiftFilter === "all" ? "btn-primary" : "btn-secondary"} btn-driver-filter" data-filter="all">
            Semua Driver (${store.drivers.length})
          </button>
          <button class="btn btn-sm ${activeShiftFilter === "on_duty" ? "btn-primary" : "btn-secondary"} btn-driver-filter" data-filter="on_duty">
            <span class="badge-dot" style="background: var(--status-success); width: 6px; height: 6px; border-radius: 50%;"></span>
            On Duty (${onDutyCount})
          </button>
          <button class="btn btn-sm ${activeShiftFilter === "standby" ? "btn-primary" : "btn-secondary"} btn-driver-filter" data-filter="standby">
            <span class="badge-dot" style="background: var(--status-warning); width: 6px; height: 6px; border-radius: 50%;"></span>
            Standby (${standbyCount})
          </button>
          <button class="btn btn-sm ${activeShiftFilter === "off_duty" ? "btn-primary" : "btn-secondary"} btn-driver-filter" data-filter="off_duty">
            <span class="badge-dot" style="background: var(--status-neutral); width: 6px; height: 6px; border-radius: 50%;"></span>
            Off Duty (${offDutyCount})
          </button>
        </div>

        <div class="search-input-wrap" style="width: 260px;">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
          <input type="text" id="driver-search-input" class="form-control" placeholder="Cari nama driver / SIM..." />
        </div>
      </div>

      <!-- Driver Cards Grid -->
      <div class="grid grid-cols-3" id="driver-cards-container">
        ${renderDriverCards(filteredDrivers)}
      </div>
    `;

    setupDriverEvents(container, renderContent);
  };

  renderContent();
}

function renderDriverCards(drivers) {
  if (drivers.length === 0) {
    return `<div class="empty-state" style="grid-column: span 3;"><p>Tidak ada driver yang cocok dengan pencarian.</p></div>`;
  }

  return drivers
    .map((driver) => {
      const truck = store.trucks.find((t) => t.id === driver.assignedTruckId);

      let statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>On Duty</span>`;
      if (driver.status === "standby") {
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span>Standby</span>`;
      } else if (driver.status === "off_duty") {
        statusBadge = `<span class="badge badge-neutral"><span class="badge-dot"></span>Off Duty</span>`;
      }

      return `
        <div class="card card-interactive" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <!-- Header Profil -->
            <div class="flex items-start justify-between" style="margin-bottom: 14px;">
              <div class="flex items-center gap-3">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #1E40AF); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                  ${driver.avatar || driver.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 class="text-primary font-semibold">${driver.name}</h4>
                  <span class="text-xs text-muted font-mono">${driver.licenseNumber}</span>
                </div>
              </div>
              ${statusBadge}
            </div>

            <!-- Detail Kontak & Penugasan -->
            <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 14px; font-size: 12px;">
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Unit Truck:</span>
                <strong>${truck ? `${truck.unitNumber} (${truck.licensePlate})` : "Belum Ditugaskan"}</strong>
              </div>
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Jadwal Shift:</span>
                <span>${driver.shift}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted">No. Handphone:</span>
                <span class="font-mono">${driver.phone}</span>
              </div>
            </div>

            <!-- Statistik Driver -->
            <div class="grid grid-cols-3" style="gap: 8px; margin-bottom: 14px; text-align: center;">
              <div style="padding: 6px; background: var(--bg-hover); border-radius: var(--radius-sm);">
                <div class="text-xs text-muted">Total Rit</div>
                <div class="text-sm font-bold text-primary">${driver.totalTrips} Rit</div>
              </div>
              <div style="padding: 6px; background: var(--bg-hover); border-radius: var(--radius-sm);">
                <div class="text-xs text-muted">Volume</div>
                <div class="text-sm font-bold text-success">${driver.totalVolume.toLocaleString("id-ID")} m³</div>
              </div>
              <div style="padding: 6px; background: var(--bg-hover); border-radius: var(--radius-sm);">
                <div class="text-xs text-muted">Safety Score</div>
                <div class="text-sm font-bold text-accent">${driver.safetyScore}%</div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <button class="btn btn-secondary btn-sm w-full btn-driver-detail" data-driver-id="${driver.id}">
            <i data-lucide="file-text" style="width: 14px; height: 14px;"></i> Riwayat Performa & Log
          </button>
        </div>
      `;
    })
    .join("");
}

function setupDriverEvents(container, renderContent) {
  if (window.lucide) window.lucide.createIcons();

  // Shift filter
  container.querySelectorAll(".btn-driver-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      container.querySelectorAll(".btn-driver-filter").forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");

      const filtered = store.drivers.filter((d) => {
        if (filter === "all") return true;
        return d.status === filter;
      });
      document.getElementById("driver-cards-container").innerHTML = renderDriverCards(filtered);
      if (window.lucide) window.lucide.createIcons();
      bindDetailButtons();
    });
  });

  // Search input
  const searchInput = document.getElementById("driver-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase().trim();
      const matched = store.drivers.filter((d) => {
        return d.name.toLowerCase().includes(val) || d.licenseNumber.toLowerCase().includes(val);
      });
      document.getElementById("driver-cards-container").innerHTML = renderDriverCards(matched);
      if (window.lucide) window.lucide.createIcons();
      bindDetailButtons();
    });
  }

  bindDetailButtons();
}

function bindDetailButtons() {
  document.querySelectorAll(".btn-driver-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const driverId = btn.getAttribute("data-driver-id");
      const driver = store.drivers.find((d) => d.id === driverId);
      if (driver) openDriverDetailModal(driver);
    });
  });
}

function openDriverDetailModal(driver) {
  const truck = store.trucks.find((t) => t.id === driver.assignedTruckId);
  const driverTrips = store.trips.filter((t) => t.driverId === driver.id);

  const modalBody = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div class="flex items-center gap-4" style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #1D4ED8); color: #fff; font-weight: 700; font-size: 20px; display: flex; align-items: center; justify-content: center;">
          ${driver.avatar || driver.name.substring(0, 2).toUpperCase()}
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="text-primary">${driver.name}</h3>
            <span class="badge badge-${driver.status === "on_duty" ? "success" : "neutral"}">${driver.status}</span>
          </div>
          <p class="text-xs text-muted font-mono">${driver.licenseNumber} &bull; Bergabung sejak ${driver.joinDate}</p>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 12px; font-size: 13px;">
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">Truck Utama</div>
          <strong>${truck ? `${truck.unitNumber} (${truck.licensePlate})` : "-"}</strong>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">Jadwal Shift</div>
          <strong>${driver.shift}</strong>
        </div>
      </div>

      <!-- Riwayat Transaksi Driver -->
      <div class="card" style="padding: 16px;">
        <h5 style="margin-bottom: 12px; font-size: 14px; font-weight: 600;">Histori Log Perjalanan (${driverTrips.length} Rit)</h5>
        <div class="table-container" style="max-height: 220px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Tiket</th>
                <th>Tanggal</th>
                <th>Sumber &rarr; Tujuan</th>
                <th>Volume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                driverTrips.length === 0
                  ? `<tr><td colspan="5" class="text-center text-muted" style="padding: 16px;">Belum ada log transaksi.</td></tr>`
                  : driverTrips
                      .map(
                        (t) => `
                    <tr>
                      <td class="font-mono text-xs">${t.ticketNo}</td>
                      <td class="text-xs">${t.date}</td>
                      <td class="text-xs font-medium">${t.sourceName.split(" ")[0]} &rarr; ${t.destinationName.split(" ")[0]}</td>
                      <td class="text-xs font-bold">${t.volume} m³</td>
                      <td><span class="badge badge-success" style="font-size: 10px; padding: 2px 6px;">${t.status}</span></td>
                    </tr>
                  `
                      )
                      .join("")
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  Modal.open(`Histori Pengemudi — ${driver.name}`, modalBody, `<button class="btn btn-primary btn-sm" data-close-modal>Tutup</button>`);
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
