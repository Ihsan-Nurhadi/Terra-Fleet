// views/destinations.js — Modul Tujuan Pengiriman (Destination Sites / Projects)

import { store, Modal } from "../app.js";
import { createBarDestinationChart } from "../charts.js";

export function renderDestinationsView(container) {
  const destinations = store.destinations;
  const totalTarget = destinations.reduce((acc, cur) => acc + cur.targetVolume, 0);
  const totalReceived = destinations.reduce((acc, cur) => acc + cur.currentVolumeReceived, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalReceived / totalTarget) * 100) : 0;

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
      <div>
        <h2>Master Data Tujuan Pengiriman (Proyek Penimbunan & Reklamasi)</h2>
        <p class="text-sm text-secondary">Pemantauan progres pemenuhan volume urugan tanah, kontraktor pelaksana, dan kapasitas daya tampung proyek.</p>
      </div>
    </div>

    <!-- Chart & Summary Section -->
    <div class="grid grid-cols-3" style="margin-bottom: 24px;">
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="building-2" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Progres Realisasi Volume vs Target per Proyek
            </h3>
            <p class="card-subtitle">Perbandingan akumulasi volume tanah diterima (m³)</p>
          </div>
        </div>
        <div style="position: relative; height: 240px; width: 100%;">
          <canvas id="chart-destinations-bar"></canvas>
        </div>
      </div>

      <!-- KPI Card -->
      <div class="card flex flex-col justify-between">
        <div>
          <div class="kpi-label" style="margin-bottom: 8px;">Total Pemenuhan Urugan</div>
          <div class="kpi-value text-2xl text-primary">${totalReceived.toLocaleString("id-ID")} m³</div>
          <div class="flex items-center justify-between" style="margin-top: 8px;">
            <span class="text-xs text-muted">Target Total: ${totalTarget.toLocaleString("id-ID")} m³</span>
            <span class="badge badge-success font-semibold">${overallPct}% Tercapai</span>
          </div>
          <div class="progress-track" style="height: 8px; margin-top: 8px;">
            <div class="progress-fill success" style="width: ${overallPct}%;"></div>
          </div>
        </div>

        <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 12px;">
          <div class="flex items-center justify-between" style="margin-bottom: 6px;">
            <span class="text-muted">Total Transaksi Diterima:</span>
            <strong class="text-accent">${destinations.reduce((a, b) => a + b.totalTripsReceived, 0).toLocaleString("id-ID")} Rit</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Proyek Berjalan:</span>
            <strong>4 Lokasi Aktif</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Destinations Grid -->
    <div class="grid grid-cols-2" id="destinations-grid-container">
      ${destinations
        .map((dest) => {
          const pct = Math.round((dest.currentVolumeReceived / dest.targetVolume) * 100);
          return `
          <div class="card card-interactive">
            <div class="flex items-start justify-between" style="margin-bottom: 12px;">
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge badge-neutral font-mono">${dest.code}</span>
                  <h3 class="text-primary font-semibold">${dest.name}</h3>
                </div>
                <p class="text-xs text-muted" style="margin-top: 4px;">
                  <i data-lucide="map-pin" style="width: 12px; height: 12px; display: inline;"></i> ${dest.location}
                </p>
              </div>
              <span class="badge badge-warning"><span class="badge-dot"></span>In Progress</span>
            </div>

            <!-- Kontraktor & PIC -->
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 14px; font-size: 12px;">
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Kontraktor / PIC:</span>
                <strong>${dest.projectManager}</strong>
              </div>
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Jam Penerimaan:</span>
                <span>${dest.receivingHours}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted">Target Selesai:</span>
                <span class="text-accent font-medium">${dest.targetCompletionDate}</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="margin-bottom: 16px;">
              <div class="flex items-center justify-between text-xs font-medium" style="margin-bottom: 6px;">
                <span>Progres Penimbunan (${pct}%)</span>
                <span>${dest.currentVolumeReceived.toLocaleString("id-ID")} / ${dest.targetVolume.toLocaleString("id-ID")} m³</span>
              </div>
              <div class="progress-track" style="height: 8px;">
                <div class="progress-fill ${pct >= 100 ? "success" : pct >= 70 ? "warning" : "danger"}" style="width: ${Math.min(pct, 100)}%;"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Total Rit Masuk: <strong>${dest.totalTripsReceived.toLocaleString("id-ID")}</strong></span>
              <button class="btn btn-secondary btn-sm btn-dest-detail" data-dest-id="${dest.id}">
                <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Detail Penerimaan
              </button>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;

  setTimeout(() => {
    const labels = destinations.map((d) => d.code);
    const dataReceived = destinations.map((d) => d.currentVolumeReceived);
    const dataTarget = destinations.map((d) => d.targetVolume);
    createBarDestinationChart("chart-destinations-bar", labels, dataReceived, dataTarget);

    if (window.lucide) window.lucide.createIcons();

    container.querySelectorAll(".btn-dest-detail").forEach((btn) => {
      btn.addEventListener("click", () => {
        const destId = btn.getAttribute("data-dest-id");
        const dest = store.destinations.find((d) => d.id === destId);
        if (dest) openDestinationDetailModal(dest);
      });
    });
  }, 50);
}

function openDestinationDetailModal(dest) {
  const destTrips = store.trips.filter((t) => t.destinationId === dest.id);

  const modalBody = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div class="flex items-center justify-between">
          <div>
            <span class="badge badge-neutral font-mono">${dest.code}</span>
            <h3 class="text-primary" style="margin-top: 4px;">${dest.name}</h3>
            <p class="text-xs text-secondary">${dest.location}</p>
          </div>
          <span class="badge badge-warning">Dalam Pengerjaan</span>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 12px; font-size: 13px;">
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">PIC Pengawas Lapangan</div>
          <strong>${dest.projectManager}</strong>
          <div class="text-xs text-muted font-mono" style="margin-top: 2px;">${dest.phone}</div>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">Catatan Pekerjaan</div>
          <p class="text-xs text-primary" style="margin-top: 2px;">${dest.notes || "-"}</p>
        </div>
      </div>

      <div class="card" style="padding: 14px;">
        <h5 style="margin-bottom: 10px; font-size: 14px; font-weight: 600;">Riwayat Penerimaan Ritase di Proyek Ini</h5>
        <div class="table-container" style="max-height: 200px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Surat Jalan</th>
                <th>Tanggal</th>
                <th>Sumber Tanah</th>
                <th>Unit</th>
                <th>Driver</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              ${
                destTrips.length === 0
                  ? `<tr><td colspan="6" class="text-center text-muted" style="padding: 12px;">Belum ada log penerimaan aktif.</td></tr>`
                  : destTrips
                      .slice(0, 6)
                      .map(
                        (t) => `
                    <tr>
                      <td class="font-mono text-xs">${t.ticketNo}</td>
                      <td class="text-xs">${t.date}</td>
                      <td class="text-xs">${t.sourceName.split(" ")[0]}</td>
                      <td class="text-xs font-semibold">${t.unitNumber}</td>
                      <td class="text-xs">${t.driverName}</td>
                      <td class="text-xs font-bold text-primary">${t.volume} m³</td>
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

  Modal.open(`Detail Proyek Tujuan — ${dest.name}`, modalBody, `<button class="btn btn-primary btn-sm" data-close-modal>Tutup</button>`);
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
