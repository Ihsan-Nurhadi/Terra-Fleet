// app.js — Central State Store & Application Core

import { INITIAL_TRUCKS } from "./data/trucks.js";
import { INITIAL_DRIVERS } from "./data/drivers.js";
import { INITIAL_SOURCES } from "./data/sources.js";
import { INITIAL_DESTINATIONS } from "./data/destinations.js";
import { INITIAL_TRIPS } from "./data/trips.js";
import { INITIAL_TARGETS } from "./data/targets.js";
import { initTheme } from "./theme.js";
import { initRouter, navigateTo } from "./router.js";

class FleetStore {
  constructor() {
    this.trucks = [...INITIAL_TRUCKS];
    this.drivers = [...INITIAL_DRIVERS];
    this.sources = [...INITIAL_SOURCES];
    this.destinations = [...INITIAL_DESTINATIONS];
    this.trips = [...INITIAL_TRIPS];
    this.targets = JSON.parse(JSON.stringify(INITIAL_TARGETS));
    this.lastSync = new Date();
  }

  // Getters & Aggregations
  getKPIs() {
    const totalTrucks = this.trucks.length;
    const activeTrucks = this.trucks.filter((t) => t.status === "active").length;
    const idleTrucks = this.trucks.filter((t) => t.status === "idle").length;
    const maintTrucks = this.trucks.filter((t) => t.status === "maintenance").length;
    const totalDrivers = this.drivers.length;
    const onDutyDrivers = this.drivers.filter((d) => d.status === "on_duty").length;

    // Filter trips for today (2026-08-20 or simulated current date)
    const todayTrips = this.trips.filter((t) => t.date === "2026-08-20");
    const completedTodayTrips = todayTrips.filter((t) => t.status === "completed");
    const todayVolume = completedTodayTrips.reduce((acc, cur) => acc + (cur.volume || 0), 0);

    // Target calculation for today
    const dailyTargetVolume = this.targets.daily
      .filter((t) => t.category === "truck")
      .reduce((acc, cur) => acc + (cur.targetVolume || 0), 0);
    const achievementPct = dailyTargetVolume > 0 ? ((todayVolume / dailyTargetVolume) * 100).toFixed(1) : 0;

    const totalAllTrips = this.trips.filter((t) => t.status === "completed").length;
    const totalAllVolume = this.trips
      .filter((t) => t.status === "completed")
      .reduce((acc, cur) => acc + (cur.volume || 0), 0);

    return {
      totalTrucks,
      activeTrucks,
      idleTrucks,
      maintTrucks,
      totalDrivers,
      onDutyDrivers,
      todayTripsCount: todayTrips.length,
      todayCompletedTripsCount: completedTodayTrips.length,
      todayVolume,
      dailyTargetVolume,
      achievementPct: Number(achievementPct),
      totalAllTrips,
      totalAllVolume
    };
  }

  // Truck Actions
  addTruck(truckData) {
    const id = `TRK-0${this.trucks.length + 1}`;
    const newTruck = {
      id,
      totalTrips: 0,
      totalVolume: 0,
      fuelLevel: 100,
      odometer: 1000,
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      ...truckData
    };
    this.trucks.unshift(newTruck);
    this.showToast(`Unit ${newTruck.unitNumber} (${newTruck.licensePlate}) berhasil ditambahkan!`, "success");
    return newTruck;
  }

  updateTruck(id, updatedData) {
    const idx = this.trucks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.trucks[idx] = { ...this.trucks[idx], ...updatedData };
      this.showToast(`Data unit ${this.trucks[idx].unitNumber} berhasil diperbarui!`, "success");
      return this.trucks[idx];
    }
    return null;
  }

  // Trip Actions
  addTrip(tripData) {
    const today = "2026-08-20";
    const tripSeq = this.trips.filter((t) => t.date === today).length + 1;
    const padSeq = String(tripSeq).padStart(2, "0");
    const id = `TRIP-${today.replace(/-/g, "")}-${padSeq}`;
    const ticketNo = `SJ-${today.replace(/-/g, "")}-${padSeq}`;

    const truck = this.trucks.find((t) => t.id === tripData.truckId);
    const driver = this.drivers.find((d) => d.id === tripData.driverId);
    const source = this.sources.find((s) => s.id === tripData.sourceId);
    const destination = this.destinations.find((d) => d.id === tripData.destinationId);

    const newTrip = {
      id,
      ticketNo,
      date: tripData.date || today,
      departureTime: tripData.departureTime || "13:00",
      arrivalTime: tripData.status === "completed" ? (tripData.arrivalTime || "14:30") : null,
      truckId: tripData.truckId,
      unitNumber: truck ? truck.unitNumber : "DT-XX",
      driverId: tripData.driverId,
      driverName: driver ? driver.name : "Driver",
      sourceId: tripData.sourceId,
      sourceName: source ? source.name : "Quarry",
      destinationId: tripData.destinationId,
      destinationName: destination ? destination.name : "Proyek",
      volume: Number(tripData.volume) || (truck ? truck.capacity : 20),
      soilType: tripData.soilType || (source ? source.soilType : "Tanah Merah Urug"),
      status: tripData.status || "completed",
      grossWeight: Number(tripData.grossWeight) || 34500,
      tareWeight: Number(tripData.tareWeight) || 14500,
      netWeight: (Number(tripData.grossWeight) || 34500) - (Number(tripData.tareWeight) || 14500),
      receivedBy: tripData.receivedBy || "Mandor Lapangan",
      photoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80",
      notes: tripData.notes || "Surat jalan terbit otomatis dari sistem."
    };

    this.trips.unshift(newTrip);

    // Update truck & driver totals if completed
    if (newTrip.status === "completed") {
      if (truck) {
        truck.totalTrips += 1;
        truck.totalVolume += newTrip.volume;
      }
      if (driver) {
        driver.totalTrips += 1;
        driver.totalVolume += newTrip.volume;
      }
      if (source) {
        source.totalTrips += 1;
        source.totalVolumeExtracted += newTrip.volume;
      }
      if (destination) {
        destination.totalTripsReceived += 1;
        destination.currentVolumeReceived += newTrip.volume;
      }
    }

    this.showToast(`Surat Jalan ${newTrip.ticketNo} berhasil dibuat!`, "success");
    return newTrip;
  }

  // Toast Notification
  showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast show`;
    
    let iconName = "check-circle";
    let colorClass = "text-success";
    if (type === "danger") {
      iconName = "alert-circle";
      colorClass = "text-danger";
    } else if (type === "warning") {
      iconName = "alert-triangle";
      colorClass = "text-warning";
    }

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="${colorClass}" style="width: 20px; height: 20px;"></i>
      <span class="text-sm font-medium text-primary">${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Export to CSV Helper
  exportTripsToCSV() {
    const headers = [
      "No Tiket",
      "Tanggal",
      "Jam Berangkat",
      "Jam Tiba",
      "No Unit",
      "Driver",
      "Lokasi Sumber",
      "Lokasi Tujuan",
      "Jenis Tanah",
      "Volume (m3)",
      "Berat Bruto (kg)",
      "Berat Tara (kg)",
      "Berat Netto (kg)",
      "Penerima",
      "Status",
      "Catatan"
    ];

    const rows = this.trips.map((t) => [
      `"${t.ticketNo}"`,
      `"${t.date}"`,
      `"${t.departureTime || "-"}"`,
      `"${t.arrivalTime || "-"}"`,
      `"${t.unitNumber}"`,
      `"${t.driverName}"`,
      `"${t.sourceName}"`,
      `"${t.destinationName}"`,
      `"${t.soilType}"`,
      t.volume,
      t.grossWeight,
      t.tareWeight,
      t.netWeight,
      `"${t.receivedBy || "-"}"`,
      `"${t.status}"`,
      `"${(t.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `log_ritase_dump_truck_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Data log ritase berhasil diexport ke file CSV!", "success");
  }
}

export const store = new FleetStore();

// Modal Helper Controller
export const Modal = {
  open(title, bodyHtml, footerHtml = null) {
    const backdrop = document.getElementById("global-modal-backdrop");
    const titleEl = document.getElementById("global-modal-title");
    const bodyEl = document.getElementById("global-modal-body");
    const footerEl = document.getElementById("global-modal-footer");

    if (backdrop && titleEl && bodyEl) {
      titleEl.innerHTML = title;
      bodyEl.innerHTML = bodyHtml;
      if (footerHtml && footerEl) {
        footerEl.innerHTML = footerHtml;
        footerEl.style.display = "flex";
      } else if (footerEl) {
        footerEl.style.display = "none";
      }
      backdrop.classList.add("show");
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  },
  close() {
    const backdrop = document.getElementById("global-modal-backdrop");
    if (backdrop) {
      backdrop.classList.remove("show");
    }
  }
};

// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRouter();

  // Setup modal close buttons
  const modalCloseBtns = document.querySelectorAll("[data-close-modal]");
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => Modal.close());
  });

  const modalBackdrop = document.getElementById("global-modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        Modal.close();
      }
    });
  }

  // Setup mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.querySelector(".app-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
      backdrop.classList.toggle("active");
    });

    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open");
      backdrop.classList.remove("active");
    });
  }

  // Refresh Sync Button
  const syncBtn = document.getElementById("btn-sync-refresh");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      syncBtn.style.transform = "rotate(360deg)";
      syncBtn.style.transition = "transform 0.5s ease";
      setTimeout(() => {
        syncBtn.style.transform = "none";
        syncBtn.style.transition = "none";
        store.showToast("Data operasional armada berhasil disinkronisasi!", "success");
        // Re-render current route
        initRouter();
      }, 500);
    });
  }

  // Global search input handling
  const globalSearchInput = document.getElementById("global-search-input");
  if (globalSearchInput) {
    globalSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = globalSearchInput.value.trim();
        if (query) {
          window.location.hash = `#/trips?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
