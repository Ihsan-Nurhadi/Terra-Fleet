// views/sources.js — Modul Sumber Tanah (Quarry / Source Locations)

import { store, Modal } from "../app.js";
import { createDoughnutDistributionChart } from "../charts.js";

export function renderSourcesView(container) {
  const sources = store.sources;
  const totalExtracted = sources.reduce((acc, cur) => acc + cur.totalVolumeExtracted, 0);

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
      <div>
        <h2>Master Data Lokasi Sumber Tanah (Quarry / Excavation Site)</h2>
        <p class="text-sm text-secondary">Monitoring kapasitas deposit galian, jenis material tanah urug, dan histori pengambilan per lokasi quarry.</p>
      </div>
    </div>

    <!-- Charts & Summary Header -->
    <div class="grid grid-cols-3" style="margin-bottom: 24px;">
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="mountain" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
              Distribusi Volume Pengambilan Tanah per Quarry
            </h3>
            <p class="card-subtitle">Perbandingan akumulasi volume tanah yang telah diekstraksi</p>
          </div>
        </div>
        <div style="position: relative; height: 240px; width: 100%;">
          <canvas id="chart-sources-breakdown"></canvas>
        </div>
      </div>

      <!-- Quick KPI Card -->
      <div class="card flex flex-col justify-between">
        <div>
          <div class="kpi-label" style="margin-bottom: 8px;">Total Ekstraksi Semua Quarry</div>
          <div class="kpi-value text-2xl text-primary">${totalExtracted.toLocaleString("id-ID")} m³</div>
          <p class="text-xs text-muted" style="margin-top: 4px;">Dari total 4 lokasi galian aktif bersertifikat</p>
        </div>

        <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 12px;">
          <div class="flex items-center justify-between" style="margin-bottom: 6px;">
            <span class="text-muted">Rata-rata Kapasitas Harian:</span>
            <strong>1.890 m³ / hari</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">Total Ritase Berangkat:</span>
            <strong class="text-accent">13.350 Rit</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Sources Grid -->
    <div class="grid grid-cols-2" id="sources-grid-container">
      ${sources
        .map((src) => {
          const pctExtracted = Math.round((src.totalVolumeExtracted / src.estimatedCapacity) * 100);
          return `
          <div class="card card-interactive">
            <div class="flex items-start justify-between" style="margin-bottom: 12px;">
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge badge-accent font-mono">${src.code}</span>
                  <h3 class="text-primary font-semibold">${src.name}</h3>
                </div>
                <p class="text-xs text-muted" style="margin-top: 4px;">
                  <i data-lucide="map-pin" style="width: 12px; height: 12px; display: inline;"></i> ${src.location}
                </p>
              </div>
              <span class="badge badge-success"><span class="badge-dot"></span>Aktif Beroperasi</span>
            </div>

            <!-- Material & PIC -->
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 14px; font-size: 12px;">
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Jenis Tanah:</span>
                <strong>${src.soilType}</strong>
              </div>
              <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                <span class="text-muted">Jam Operasional:</span>
                <span>${src.operatingHours}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted">PIC Lapangan:</span>
                <span>${src.pic}</span>
              </div>
            </div>

            <!-- Capacity Progress -->
            <div style="margin-bottom: 16px;">
              <div class="flex items-center justify-between text-xs font-medium" style="margin-bottom: 6px;">
                <span>Deposit Terpakai (${pctExtracted}%)</span>
                <span>${src.totalVolumeExtracted.toLocaleString("id-ID")} / ${src.estimatedCapacity.toLocaleString("id-ID")} m³</span>
              </div>
              <div class="progress-track" style="height: 8px;">
                <div class="progress-fill ${pctExtracted > 80 ? "warning" : "primary"}" style="width: ${pctExtracted}%;"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Total Rit: <strong>${src.totalTrips.toLocaleString("id-ID")}</strong></span>
              <button class="btn btn-secondary btn-sm btn-source-detail" data-source-id="${src.id}">
                <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Detail Relasi Quarry
              </button>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;

  setTimeout(() => {
    const labels = sources.map((s) => s.name.replace("Quarry ", "").replace("Tambang ", ""));
    const data = sources.map((s) => s.totalVolumeExtracted);
    createDoughnutDistributionChart("chart-sources-breakdown", labels, data);

    if (window.lucide) window.lucide.createIcons();

    container.querySelectorAll(".btn-source-detail").forEach((btn) => {
      btn.addEventListener("click", () => {
        const srcId = btn.getAttribute("data-source-id");
        const src = store.sources.find((s) => s.id === srcId);
        if (src) openSourceDetailModal(src);
      });
    });
  }, 50);
}

function openSourceDetailModal(source) {
  const sourceTrips = store.trips.filter((t) => t.sourceId === source.id);
  
  // Find distinct trucks that hauled from this source
  const hauledTruckIds = [...new Set(sourceTrips.map((t) => t.truckId))];
  const hauledTrucks = hauledTruckIds.map((id) => store.trucks.find((t) => t.id === id)).filter(Boolean);

  const modalBody = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div class="flex items-center justify-between">
          <div>
            <span class="badge badge-accent font-mono">${source.code}</span>
            <h3 class="text-primary" style="margin-top: 4px;">${source.name}</h3>
            <p class="text-xs text-secondary">${source.location}</p>
          </div>
          <span class="badge badge-success">Aktif</span>
        </div>
      </div>

      <div class="grid grid-cols-2" style="gap: 12px; font-size: 13px;">
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">Material Spesifik</div>
          <strong>${source.soilType}</strong>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="text-xs text-muted">Koordinat GPS</div>
          <strong class="font-mono">${source.coordinate}</strong>
        </div>
      </div>

      <div class="card" style="padding: 14px;">
        <h5 style="margin-bottom: 8px; font-size: 14px; font-weight: 600;">Armada yang Pernah Mengambil dari Lokasi Ini</h5>
        <div class="flex items-center gap-2 flex-wrap">
          ${hauledTrucks.map((t) => `<span class="badge badge-neutral">${t.unitNumber} (${t.capacity}m³)</span>`).join(" ") || "<span class='text-muted text-xs'>Belum ada unit terdata di log aktif.</span>"}
        </div>
      </div>

      <div class="card" style="padding: 14px;">
        <h5 style="margin-bottom: 10px; font-size: 14px; font-weight: 600;">Pengiriman Terbaru dari Quarry Ini</h5>
        <div class="table-container" style="max-height: 180px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Surat Jalan</th>
                <th>Tanggal</th>
                <th>Tujuan</th>
                <th>Unit</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              ${
                sourceTrips.length === 0
                  ? `<tr><td colspan="5" class="text-center text-muted" style="padding: 12px;">Belum ada log rit aktif.</td></tr>`
                  : sourceTrips
                      .slice(0, 5)
                      .map(
                        (t) => `
                    <tr>
                      <td class="font-mono text-xs">${t.ticketNo}</td>
                      <td class="text-xs">${t.date}</td>
                      <td class="text-xs">${t.destinationName.split(" ")[0]}</td>
                      <td class="text-xs font-semibold">${t.unitNumber}</td>
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

  Modal.open(`Detail Lokasi Sumber — ${source.name}`, modalBody, `<button class="btn btn-primary btn-sm" data-close-modal>Tutup</button>`);
  document.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => Modal.close()));
}
