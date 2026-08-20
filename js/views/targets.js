// views/targets.js — Modul Target & Achievement Monitoring

import { store, Modal } from "../app.js";

export function renderTargetsView(container) {
  let currentPeriod = "daily"; // daily | weekly | monthly

  const renderContent = () => {
    const targetsList = store.targets[currentPeriod] || [];

    container.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
        <div>
          <h2>Target Operasional & Pencapaian (Achievement KPI)</h2>
          <p class="text-sm text-secondary">Pengaturan dan evaluasi target volume dan ritase per armada, sumber, dan proyek tujuan.</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btn-adjust-target" class="btn btn-primary">
            <i data-lucide="sliders" style="width: 16px; height: 16px;"></i> Sesuaikan Target Baru
          </button>
        </div>
      </div>

      <!-- Period Tabs -->
      <div class="tabs-container">
        <button class="tab-btn ${currentPeriod === "daily" ? "active" : ""} btn-tab" data-period="daily">
          <i data-lucide="calendar" style="width: 14px; height: 14px; display: inline;"></i> Target Harian (20 Ags 2026)
        </button>
        <button class="tab-btn ${currentPeriod === "weekly" ? "active" : ""} btn-tab" data-period="weekly">
          <i data-lucide="calendar-days" style="width: 14px; height: 14px; display: inline;"></i> Target Mingguan (Minggu ke-3)
        </button>
        <button class="tab-btn ${currentPeriod === "monthly" ? "active" : ""} btn-tab" data-period="monthly">
          <i data-lucide="calendar-range" style="width: 14px; height: 14px; display: inline;"></i> Target Bulanan (Agustus 2026)
        </button>
      </div>

      <!-- Achievement Legend Guide -->
      <div class="flex items-center justify-between flex-wrap gap-4" style="background: var(--bg-elevated); padding: 12px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px; font-size: 12px;">
        <span class="font-medium text-secondary">Indikator Status Pencapaian Target:</span>
        <div class="flex items-center gap-4 flex-wrap">
          <span class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--status-success);"></span>
            <strong>&ge; 100%</strong> (Mencapai Target / Optimal)
          </span>
          <span class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--status-warning);"></span>
            <strong>70% &ndash; 99%</strong> (On Track / Memadai)
          </span>
          <span class="flex items-center gap-2">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--status-danger);"></span>
            <strong>&lt; 70%</strong> (Perlu Evaluasi & Percepatan)
          </span>
        </div>
      </div>

      <!-- Targets Table -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kategori / Entitas</th>
                <th>Nama Entitas</th>
                <th>Target Rit</th>
                <th>Realisasi Rit</th>
                <th>Target Volume</th>
                <th>Realisasi Volume</th>
                <th style="min-width: 220px;">Persentase Achievement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${renderTargetsTableRows(targetsList)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    setupTargetsEvents(container, renderContent);
  };

  renderContent();
}

function renderTargetsTableRows(targets) {
  if (targets.length === 0) {
    return `<tr><td colspan="8" class="empty-state"><p>Tidak ada target yang tercatat pada periode ini.</p></td></tr>`;
  }

  return targets
    .map((item) => {
      const pct = item.targetVolume > 0 ? Math.round((item.actualVolume / item.targetVolume) * 100) : 0;

      let fillClass = "danger";
      let statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Kurang (&lt;70%)</span>`;
      if (pct >= 100) {
        fillClass = "success";
        statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Tercapai (&ge;100%)</span>`;
      } else if (pct >= 70) {
        fillClass = "warning";
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span>Cukup (70-99%)</span>`;
      }

      let categoryBadge = `<span class="badge badge-accent">Armada Truck</span>`;
      if (item.category === "source") categoryBadge = `<span class="badge badge-neutral">Sumber Galian</span>`;
      if (item.category === "destination" || item.category === "project") categoryBadge = `<span class="badge badge-neutral">Proyek Tujuan</span>`;

      return `
        <tr>
          <td>${categoryBadge}</td>
          <td>
            <div class="font-semibold text-primary">${item.entityName}</div>
            <span class="text-xs text-muted font-mono">${item.entityId}</span>
          </td>
          <td><span class="font-medium">${item.targetTrips} Rit</span></td>
          <td><span class="font-bold text-primary">${item.actualTrips} Rit</span></td>
          <td><span class="font-medium">${item.targetVolume.toLocaleString("id-ID")} m³</span></td>
          <td><span class="font-bold text-primary">${item.actualVolume.toLocaleString("id-ID")} m³</span></td>
          <td>
            <div class="progress-container">
              <div class="progress-track" style="height: 8px;">
                <div class="progress-fill ${fillClass}" style="width: ${Math.min(pct, 100)}%;"></div>
              </div>
              <span class="progress-label text-${fillClass}">${pct}%</span>
            </div>
          </td>
          <td>${statusBadge}</td>
        </tr>
      `;
    })
    .join("");
}

function setupTargetsEvents(container, renderContent) {
  if (window.lucide) window.lucide.createIcons();

  // Period Tabs
  container.querySelectorAll(".btn-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const period = btn.getAttribute("data-period");
      renderTargetsViewWithPeriod(container, period);
    });
  });

  // Adjust Target Button
  const btnAdjust = document.getElementById("btn-adjust-target");
  if (btnAdjust) {
    btnAdjust.addEventListener("click", () => {
      openAdjustTargetModal(renderContent);
    });
  }
}

function renderTargetsViewWithPeriod(container, period) {
  container.querySelectorAll(".btn-tab").forEach((b) => b.classList.remove("active"));
  const activeBtn = container.querySelector(`.btn-tab[data-period="${period}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const targetsList = store.targets[period] || [];
  const tbody = container.querySelector("tbody");
  if (tbody) {
    tbody.innerHTML = renderTargetsTableRows(targetsList);
    if (window.lucide) window.lucide.createIcons();
  }
}

function openAdjustTargetModal(renderContent) {
  const truckOptions = store.trucks.map((t) => `<option value="${t.id}">${t.unitNumber} (${t.licensePlate})</option>`).join("");

  const modalBody = `
    <form id="form-adjust-target">
      <div class="grid grid-cols-2" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Kategori Target *</label>
          <select id="target-input-category" class="form-select">
            <option value="truck">Armada Truck</option>
            <option value="source">Sumber Galian (Quarry)</option>
            <option value="destination">Proyek Tujuan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Pilih Entitas *</label>
          <select id="target-input-entity" class="form-select">
            ${truckOptions}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3" style="gap: 16px;">
        <div class="form-group">
          <label class="form-label">Periode</label>
          <select id="target-input-period" class="form-select">
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target Ritase (Rit) *</label>
          <input type="number" id="target-input-trips" class="form-control" value="4" min="1" required />
        </div>
        <div class="form-group">
          <label class="form-label">Target Volume (m³) *</label>
          <input type="number" id="target-input-volume" class="form-control" value="80" min="10" required />
        </div>
      </div>
    </form>
  `;

  const modalFooter = `
    <button class="btn btn-secondary btn-sm" data-close-modal>Batal</button>
    <button id="btn-save-target" class="btn btn-primary btn-sm">
      <i data-lucide="check" style="width: 14px; height: 14px;"></i> Simpan Pengaturan Target
    </button>
  `;

  Modal.open("Pengaturan & Penyesuaian Target Operasional", modalBody, modalFooter);

  document.getElementById("btn-save-target").addEventListener("click", () => {
    const period = document.getElementById("target-input-period").value;
    const entityId = document.getElementById("target-input-entity").value;
    const targetTrips = Number(document.getElementById("target-input-trips").value) || 3;
    const targetVolume = Number(document.getElementById("target-input-volume").value) || 60;

    // Check if exists or push
    const list = store.targets[period];
    const existing = list.find((t) => t.entityId === entityId);
    if (existing) {
      existing.targetTrips = targetTrips;
      existing.targetVolume = targetVolume;
    } else {
      const truck = store.trucks.find((t) => t.id === entityId);
      list.push({
        id: `TGT-${Date.now()}`,
        category: "truck",
        entityId,
        entityName: truck ? `${truck.unitNumber} (${truck.licensePlate})` : entityId,
        targetTrips,
        targetVolume,
        actualTrips: 2,
        actualVolume: 40,
        unit: "m³"
      });
    }

    store.showToast("Target operasional berhasil diperbarui!", "success");
    Modal.close();
    renderContent();
  });

  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
