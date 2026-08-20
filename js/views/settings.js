// views/settings.js — Modul Pengaturan & Backup Data

import { store } from "../app.js";
import { getTheme, setTheme } from "../theme.js";

export function renderSettingsView(container) {
  const currentTheme = getTheme();

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4" style="margin-bottom: 20px;">
      <div>
        <h2>Pengaturan Sistem & Ekspor Data Operasional</h2>
        <p class="text-sm text-secondary">Preferensi tampilan antarmuka, profil armada operasional, dan manajemen pencadangan data mock.</p>
      </div>
    </div>

    <div class="grid grid-cols-2" style="gap: 24px;">
      <!-- Profil Sistem & Operasional -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i data-lucide="sliders" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
            Profil Operasional Armada
          </h3>
        </div>

        <div class="form-group">
          <label class="form-label">Nama Perusahaan / Kontraktor</label>
          <input type="text" class="form-control" value="PT Antara Nusantara Logistik Tanah" readonly />
        </div>

        <div class="form-group">
          <label class="form-label">Basis Operasi (Central Pool)</label>
          <input type="text" class="form-control" value="Pool Cikarang & Basecamp Citeureup" readonly />
        </div>

        <div class="grid grid-cols-2" style="gap: 12px;">
          <div class="form-group">
            <label class="form-label">Zona Waktu</label>
            <input type="text" class="form-control" value="Asia/Jakarta (WIB)" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Mata Uang & Satuan</label>
            <input type="text" class="form-control" value="Meter Kubik (m³)" readonly />
          </div>
        </div>
      </div>

      <!-- Preferensi Tampilan & Tema -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i data-lucide="palette" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
            Pengaturan Tema & Tampilan
          </h3>
        </div>

        <p class="text-xs text-muted" style="margin-bottom: 16px;">
          Pilih tema sesuai kondisi operasional. Light Mode untuk pemantauan siang hari di kantor, dan Dark Mode untuk ruang kontrol malam atau kondisi lapangan minim cahaya.
        </p>

        <div class="grid grid-cols-2" style="gap: 12px; margin-bottom: 16px;">
          <button id="btn-theme-light" class="btn ${currentTheme === "light" ? "btn-primary" : "btn-secondary"}" style="padding: 12px;">
            <i data-lucide="sun" style="width: 18px; height: 18px;"></i>
            Light Mode
          </button>
          <button id="btn-theme-dark" class="btn ${currentTheme === "dark" ? "btn-primary" : "btn-secondary"}" style="padding: 12px;">
            <i data-lucide="moon" style="width: 18px; height: 18px;"></i>
            Dark Mode
          </button>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px;">
          <span class="text-muted">Status Penyimpanan:</span>
          <strong>Tersimpan di LocalStorage browser</strong>
        </div>
      </div>
    </div>

    <!-- Backup & Export Section -->
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <i data-lucide="database" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>
            Ekspor & Cadangan Data Mockup
          </h3>
          <p class="card-subtitle">Unduh seluruh riwayat ritase atau reset ke data dummy awal</p>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <button id="btn-export-csv-settings" class="btn btn-primary">
          <i data-lucide="file-spreadsheet" style="width: 16px; height: 16px;"></i> Ekspor Log Ritase (.CSV)
        </button>

        <button id="btn-export-json" class="btn btn-secondary">
          <i data-lucide="code" style="width: 16px; height: 16px;"></i> Ekspor Database Lengkap (.JSON)
        </button>

        <button id="btn-reset-store" class="btn btn-secondary text-danger">
          <i data-lucide="rotate-ccw" style="width: 16px; height: 16px;"></i> Muat Ulang Data Asli
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();

    // Theme buttons
    const btnLight = document.getElementById("btn-theme-light");
    const btnDark = document.getElementById("btn-theme-dark");

    if (btnLight && btnDark) {
      btnLight.addEventListener("click", () => {
        setTheme("light", true);
        renderSettingsView(container);
      });
      btnDark.addEventListener("click", () => {
        setTheme("dark", true);
        renderSettingsView(container);
      });
    }

    // Export CSV
    const btnCsv = document.getElementById("btn-export-csv-settings");
    if (btnCsv) {
      btnCsv.addEventListener("click", () => store.exportTripsToCSV());
    }

    // Export JSON
    const btnJson = document.getElementById("btn-export-json");
    if (btnJson) {
      btnJson.addEventListener("click", () => {
        const fullData = {
          trucks: store.trucks,
          drivers: store.drivers,
          sources: store.sources,
          destinations: store.destinations,
          trips: store.trips,
          targets: store.targets,
          exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `dump_truck_monitoring_backup_${new Date().toISOString().split("T")[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        store.showToast("Backup data JSON berhasil diunduh!", "success");
      });
    }

    // Reset Store
    const btnReset = document.getElementById("btn-reset-store");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin memuat ulang seluruh data mockup ke nilai awal?")) {
          window.location.reload();
        }
      });
    }
  }, 50);
}
