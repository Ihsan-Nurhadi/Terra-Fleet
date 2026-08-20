// views/trucks.js — Armada Dump Truck Module

import { store, Modal } from "../app.js";

export function renderTrucksView(container) {
  let activeFilter = "all";

  const renderContent = () => {
    const filteredTrucks = store.trucks.filter((truck) => {
      if (activeFilter === "all") return true;
      return truck.status === activeFilter;
    });

    const activeCount = store.trucks.filter((t) => t.status === "active").length;
    const idleCount = store.trucks.filter((t) => t.status === "idle").length;
    const maintCount = store.trucks.filter((t) => t.status === "maintenance").length;

    container.innerHTML = `
      <!-- Header & Actions -->
      <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
        <div>
          <h2>Master Data Armada Dump Truck</h2>
          <p class="text-sm text-secondary">Manajemen spesifikasi unit, status operasional, kapasitas muat, dan penugasan driver.</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btn-add-truck" class="btn btn-primary">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Tambah Unit Truck
          </button>
        </div>
      </div>

      <!-- Quick Status Filter Pills -->
      <div class="filter-bar">
        <div class="filter-group">
          <button class="btn btn-sm ${activeFilter === "all" ? "btn-primary" : "btn-secondary"} btn-filter" data-filter="all">
            Semua Unit (${store.trucks.length})
          </button>
          <button class="btn btn-sm ${activeFilter === "active" ? "btn-primary" : "btn-secondary"} btn-filter" data-filter="active">
            <span class="badge-dot" style="background: var(--status-success); width: 6px; height: 6px; border-radius: 50%;"></span>
            Aktif (${activeCount})
          </button>
          <button class="btn btn-sm ${activeFilter === "idle" ? "btn-primary" : "btn-secondary"} btn-filter" data-filter="idle">
            <span class="badge-dot" style="background: var(--status-neutral); width: 6px; height: 6px; border-radius: 50%;"></span>
            Idle / Standby (${idleCount})
          </button>
          <button class="btn btn-sm ${activeFilter === "maintenance" ? "btn-primary" : "btn-secondary"} btn-filter" data-filter="maintenance">
            <span class="badge-dot" style="background: var(--status-danger); width: 6px; height: 6px; border-radius: 50%;"></span>
            Maintenance (${maintCount})
          </button>
        </div>

        <div class="search-input-wrap" style="width: 260px;">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
          <input type="text" id="truck-search-input" class="form-control" placeholder="Cari unit / nopol / tipe..." />
        </div>
      </div>

      <!-- Trucks Data Table -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Unit</th>
                <th>No. Polisi & Tipe</th>
                <th>Kapasitas</th>
                <th>Status Unit</th>
                <th>Driver Bertugas (Shift)</th>
                <th>Total Ritase</th>
                <th>Total Volume</th>
                <th>Level BBM</th>
                <th>Jadwal Servis</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="truck-table-body">
              ${renderTruckTableRows(filteredTrucks)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Re-bind Event Listeners
    setupTrucksEventListeners(container, renderContent);
  };

  renderContent();
}

function renderTruckTableRows(trucks) {
  if (trucks.length === 0) {
    return `
      <tr>
        <td colspan="10" class="empty-state">
          <i data-lucide="truck" class="empty-state-icon"></i>
          <p>Tidak ada data armada truck yang sesuai filter.</p>
        </td>
      </tr>
    `;
  }

  return trucks
    .map((truck) => {
      const driver = store.drivers.find((d) => d.id === truck.currentDriverId);

      let statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Aktif Operasi</span>`;
      if (truck.status === "idle") {
        statusBadge = `<span class="badge badge-neutral"><span class="badge-dot"></span>Standby / Idle</span>`;
      } else if (truck.status === "maintenance") {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Maintenance</span>`;
      }

      const assignedDriverNames = (truck.assignedDrivers || [])
        .map((did) => {
          const d = store.drivers.find((x) => x.id === did);
          return d ? d.name : did;
        })
        .join(", ");

      return `
        <tr>
          <td>
            <div class="font-bold text-md text-primary">${truck.unitNumber}</div>
            <span class="text-xs text-muted font-mono">${truck.id}</span>
          </td>
          <td>
            <div class="font-medium text-primary">${truck.licensePlate}</div>
            <div class="text-xs text-secondary">${truck.brandModel}</div>
          </td>
          <td>
            <span class="badge badge-accent" style="font-weight: 600;">${truck.capacity} m³</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div class="text-sm font-medium text-primary">${driver ? driver.name : "<span class='text-muted'>Tidak Ada Driver</span>"}</div>
            <div class="text-xs text-muted" title="Semua Driver: ${assignedDriverNames}">
              Shift: ${truck.shift}
            </div>
          </td>
          <td><span class="font-semibold text-primary">${truck.totalTrips} Rit</span></td>
          <td><span class="font-semibold text-primary">${truck.totalVolume.toLocaleString("id-ID")} m³</span></td>
          <td>
            <div class="flex items-center gap-2">
              <div class="progress-track" style="width: 50px; height: 6px;">
                <div class="progress-fill ${truck.fuelLevel < 30 ? "danger" : "primary"}" style="width: ${truck.fuelLevel}%;"></div>
              </div>
              <span class="text-xs font-medium">${truck.fuelLevel}%</span>
            </div>
          </td>
          <td>
            <div class="text-xs">Berikutnya: <strong>${truck.nextMaintenance || "-"}</strong></div>
            <div class="text-xs text-muted">Lalu: ${truck.lastMaintenance || "-"}</div>
          </td>
          <td style="text-align: right;">
            <div class="flex items-center justify-end gap-1">
              <button class="btn btn-secondary btn-sm btn-truck-detail" data-truck-id="${truck.id}" title="Lihat Detail & Riwayat">
                <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="btn btn-secondary btn-sm btn-truck-edit" data-truck-id="${truck.id}" title="Edit Data Unit">
                <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function setupTrucksEventListeners(container, reRender) {
  if (window.lucide) window.lucide.createIcons();

  // Filter Buttons
  container.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      container.querySelectorAll(".btn-filter").forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");

      const filteredTrucks = store.trucks.filter((truck) => {
        if (filter === "all") return true;
        return truck.status === filter;
      });
      document.getElementById("truck-table-body").innerHTML = renderTruckTableRows(filteredTrucks);
      if (window.lucide) window.lucide.createIcons();
      bindRowActions();
    });
  });

  // Search Input
  const searchInput = document.getElementById("truck-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase().trim();
      const matchedTrucks = store.trucks.filter((t) => {
        return (
          t.unitNumber.toLowerCase().includes(val) ||
          t.licensePlate.toLowerCase().includes(val) ||
          t.brandModel.toLowerCase().includes(val)
        );
      });
      document.getElementById("truck-table-body").innerHTML = renderTruckTableRows(matchedTrucks);
      if (window.lucide) window.lucide.createIcons();
      bindRowActions();
    });
  }

  // Add Truck Button
  const btnAdd = document.getElementById("btn-add-truck");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      openAddTruckModal(reRender);
    });
  }

  bindRowActions();
}

function bindRowActions() {
  // Detail Modal
  document.querySelectorAll(".btn-truck-detail").forEach((btn) => {
    btn.addEventListener("click", () => {
      const truckId = btn.getAttribute("data-truck-id");
      const truck = store.trucks.find((t) => t.id === truckId);
      if (truck) openTruckDetailModal(truck);
    });
  });

  // Edit Modal
  document.querySelectorAll(".btn-truck-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const truckId = btn.getAttribute("data-truck-id");
      const truck = store.trucks.find((t) => t.id === truckId);
      if (truck) openEditTruckModal(truck);
    });
  });
}

function openTruckDetailModal(truck) {
  const driver = store.drivers.find((d) => d.id === truck.currentDriverId);
  const truckTrips = store.trips.filter((t) => t.truckId === truck.id);

  const assignedDriversList = (truck.assignedDrivers || [])
    .map((did) => {
      const d = store.drivers.find((x) => x.id === did);
      return d ? `<span class="badge badge-neutral">${d.name} (${d.shift})</span>` : "";
    })
    .join(" ");

  const modalBody = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Unit Header Badge -->
      <div class="flex items-center justify-between" style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div>
          <span class="text-xs text-muted font-semibold uppercase">Unit Dump Truck</span>
          <h3 class="text-primary">${truck.unitNumber} &mdash; ${truck.licensePlate}</h3>
          <p class="text-xs text-secondary">${truck.brandModel} (${truck.type})</p>
        </div>
        <span class="badge badge-${truck.status === "active" ? "success" : truck.status === "idle" ? "neutral" : "danger"}">
          ${truck.status === "active" ? "Aktif Operasi" : truck.status === "idle" ? "Idle / Standby" : "Maintenance"}
        </span>
      </div>

      <!-- Quick Specs Cards -->
      <div class="grid grid-cols-3" style="gap: 12px;">
        <div class="card" style="padding: 14px; text-align: center;">
          <div class="text-xs text-muted">Kapasitas Bak</div>
          <div class="text-lg font-bold text-primary">${truck.capacity} m³</div>
        </div>
        <div class="card" style="padding: 14px; text-align: center;">
          <div class="text-xs text-muted">Total Ritase</div>
          <div class="text-lg font-bold text-accent">${truck.totalTrips} Rit</div>
        </div>
        <div class="card" style="padding: 14px; text-align: center;">
          <div class="text-xs text-muted">Total Volume</div>
          <div class="text-lg font-bold text-success">${truck.totalVolume.toLocaleString("id-ID")} m³</div>
        </div>
      </div>

      <!-- Driver & Shift Info -->
      <div class="card" style="padding: 16px;">
        <h5 style="margin-bottom: 8px; font-size: 14px; font-weight: 600;">Driver Bertugas & Multi-Driver Roster</h5>
        <p class="text-sm" style="margin-bottom: 8px;">Driver Aktif Saat Ini: <strong>${driver ? driver.name : "-"}</strong> (Shift: ${truck.shift})</p>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-muted">Daftar Pengemudi Terdaftar:</span>
          ${assignedDriversList}
        </div>
      </div>

      <!-- Riwayat Perjalanan Unit -->
      <div class="card" style="padding: 16px;">
        <h5 style="margin-bottom: 12px; font-size: 14px; font-weight: 600;">Riwayat Pengangkutan Terbaru Unit Ini</h5>
        <div class="table-container" style="max-height: 200px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Surat Jalan</th>
                <th>Tanggal</th>
                <th>Driver</th>
                <th>Rute</th>
                <th>Volume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                truckTrips.length === 0
                  ? `<tr><td colspan="6" class="text-center text-muted" style="padding: 16px;">Belum ada riwayat trip.</td></tr>`
                  : truckTrips
                      .slice(0, 5)
                      .map(
                        (t) => `
                    <tr>
                      <td class="font-mono text-xs">${t.ticketNo}</td>
                      <td class="text-xs">${t.date}</td>
                      <td class="text-xs">${t.driverName}</td>
                      <td class="text-xs">${t.sourceName.split(" ")[0]} &rarr; ${t.destinationName.split(" ")[0]}</td>
                      <td class="text-xs font-semibold">${t.volume} m³</td>
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

  Modal.open(`Detail Unit Truck — ${truck.unitNumber}`, modalBody, `<button class="btn btn-primary btn-sm" data-close-modal>Tutup</button>`);
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}

function openAddTruckModal(reRender) {
  const driverOptions = store.drivers.map((d) => `<option value="${d.id}">${d.name}</option>`).join("");

  const modalBody = `
    <form id="form-add-truck">
      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">No. Unit *</label>
          <input type="text" id="input-truck-unit" class="form-control" placeholder="Contoh: DT-09" value="DT-0${store.trucks.length + 1}" required />
        </div>
        <div class="form-group">
          <label class="form-label">No. Polisi *</label>
          <input type="text" id="input-truck-plate" class="form-control" placeholder="Contoh: B 9988 XYZ" required />
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Merek & Model Truk *</label>
          <input type="text" id="input-truck-brand" class="form-control" value="Hino 500 FM 260 JD" required />
        </div>
        <div class="form-group">
          <label class="form-label">Tipe Konfigurasi Roda</label>
          <select id="input-truck-type" class="form-select">
            <option value="Dump Truck 6x4">Dump Truck 6x4 (Tronton)</option>
            <option value="Dump Truck 6x2">Dump Truck 6x2</option>
            <option value="Dump Truck 4x2">Dump Truck 4x2 (Engkel)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Kapasitas Bak (m³) *</label>
          <input type="number" id="input-truck-capacity" class="form-control" value="20" min="8" max="40" required />
        </div>
        <div class="form-group">
          <label class="form-label">Status Unit</label>
          <select id="input-truck-status" class="form-select">
            <option value="active">Aktif Operasi</option>
            <option value="idle">Idle / Standby</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Driver Utama</label>
          <select id="input-truck-driver" class="form-select">
            <option value="">-- Pilih Driver --</option>
            ${driverOptions}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Kondisi Unit</label>
        <input type="text" id="input-truck-notes" class="form-control" placeholder="Catatan servis, ban, hidrolik..." value="Unit baru registrasi operasional." />
      </div>
    </form>
  `;

  const modalFooter = `
    <button class="btn btn-secondary btn-sm" data-close-modal>Batal</button>
    <button id="btn-save-new-truck" class="btn btn-primary btn-sm">
      <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Simpan Unit Truck
    </button>
  `;

  Modal.open("Tambah Unit Dump Truck Baru", modalBody, modalFooter);

  document.getElementById("btn-save-new-truck").addEventListener("click", () => {
    const unitNumber = document.getElementById("input-truck-unit").value;
    const licensePlate = document.getElementById("input-truck-plate").value;
    const brandModel = document.getElementById("input-truck-brand").value;
    const type = document.getElementById("input-truck-type").value;
    const capacity = Number(document.getElementById("input-truck-capacity").value) || 20;
    const status = document.getElementById("input-truck-status").value;
    const currentDriverId = document.getElementById("input-truck-driver").value || null;
    const notes = document.getElementById("input-truck-notes").value;

    store.addTruck({
      unitNumber,
      licensePlate,
      brandModel,
      type,
      capacity,
      status,
      currentDriverId,
      assignedDrivers: currentDriverId ? [currentDriverId] : [],
      shift: "Siang (07:00 - 16:00)",
      notes
    });

    Modal.close();
    reRender();
  });

  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}

function openEditTruckModal(truck) {
  const driverOptions = store.drivers
    .map((d) => `<option value="${d.id}" ${d.id === truck.currentDriverId ? "selected" : ""}>${d.name}</option>`)
    .join("");

  const modalBody = `
    <form id="form-edit-truck">
      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">No. Unit</label>
          <input type="text" id="edit-truck-unit" class="form-control" value="${truck.unitNumber}" required />
        </div>
        <div class="form-group">
          <label class="form-label">No. Polisi</label>
          <input type="text" id="edit-truck-plate" class="form-control" value="${truck.licensePlate}" required />
        </div>
      </div>

      <div class="grid grid-cols-3" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Kapasitas Bak (m³)</label>
          <input type="number" id="edit-truck-capacity" class="form-control" value="${truck.capacity}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Status Unit</label>
          <select id="edit-truck-status" class="form-select">
            <option value="active" ${truck.status === "active" ? "selected" : ""}>Aktif Operasi</option>
            <option value="idle" ${truck.status === "idle" ? "selected" : ""}>Idle / Standby</option>
            <option value="maintenance" ${truck.status === "maintenance" ? "selected" : ""}>Maintenance</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Driver Utama</label>
          <select id="edit-truck-driver" class="form-select">
            <option value="">-- Tidak Ada Driver --</option>
            ${driverOptions}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Catatan Operasional</label>
        <input type="text" id="edit-truck-notes" class="form-control" value="${truck.notes || ""}" />
      </div>
    </form>
  `;

  const modalFooter = `
    <button class="btn btn-secondary btn-sm" data-close-modal>Batal</button>
    <button id="btn-save-edit-truck" class="btn btn-primary btn-sm">
      <i data-lucide="check" style="width: 14px; height: 14px;"></i> Simpan Perubahan
    </button>
  `;

  Modal.open(`Edit Data Unit — ${truck.unitNumber}`, modalBody, modalFooter);

  document.getElementById("btn-save-edit-truck").addEventListener("click", () => {
    const updated = {
      unitNumber: document.getElementById("edit-truck-unit").value,
      licensePlate: document.getElementById("edit-truck-plate").value,
      capacity: Number(document.getElementById("edit-truck-capacity").value),
      status: document.getElementById("edit-truck-status").value,
      currentDriverId: document.getElementById("edit-truck-driver").value || null,
      notes: document.getElementById("edit-truck-notes").value
    };

    store.updateTruck(truck.id, updated);
    Modal.close();
    renderTrucksView(document.getElementById("main-content-view"));
  });

  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
