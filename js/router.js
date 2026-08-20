// router.js — Client-Side Hash Router & View Switcher

import { renderDashboardView } from "./views/dashboard.js";
import { renderLiveMapView } from "./views/map.js";
import { renderTrucksView } from "./views/trucks.js";
import { renderDriversView } from "./views/drivers.js";
import { renderTripsView } from "./views/trips.js";
import { renderSourcesView } from "./views/sources.js";
import { renderDestinationsView } from "./views/destinations.js";
import { renderTargetsView } from "./views/targets.js";
import { renderSettingsView } from "./views/settings.js";
import { destroyAllCharts } from "./charts.js";

const routes = {
  "/": { title: "Dashboard Monitoring", render: renderDashboardView },
  "/dashboard": { title: "Dashboard Monitoring", render: renderDashboardView },
  "/map": { title: "Peta Armada (Live Map)", render: renderLiveMapView },
  "/trucks": { title: "Armada Dump Truck", render: renderTrucksView },
  "/drivers": { title: "Monitoring Driver", render: renderDriversView },
  "/trips": { title: "Data Pengiriman (Rit Log)", render: renderTripsView },
  "/sources": { title: "Lokasi Sumber Tanah (Quarry)", render: renderSourcesView },
  "/destinations": { title: "Tujuan Pengiriman Proyek", render: renderDestinationsView },
  "/targets": { title: "Target & Pencapaian (KPI)", render: renderTargetsView },
  "/settings": { title: "Pengaturan Sistem & Export", render: renderSettingsView }
};

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || "/";
  const [path, queryString] = hash.split("?");
  const route = routes[path] || routes["/"];

  // Update Page Title in Topbar & Document
  const pageTitleEl = document.getElementById("current-page-title");
  if (pageTitleEl) {
    pageTitleEl.textContent = route.title;
  }
  document.title = `${route.title} — Dump Truck Fleet Monitoring`;

  // Update Active Sidebar Link
  const navItems = document.querySelectorAll(".nav-item[data-route]");
  navItems.forEach((item) => {
    const routeAttr = item.getAttribute("data-route");
    if (routeAttr === path || (path === "/" && routeAttr === "/dashboard")) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Close Mobile Sidebar if open
  const sidebar = document.querySelector(".app-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (sidebar && backdrop && sidebar.classList.contains("mobile-open")) {
    sidebar.classList.remove("mobile-open");
    backdrop.classList.remove("active");
  }

  // Cleanup old charts before rendering new view
  destroyAllCharts();

  // Render View Container
  const mainContent = document.getElementById("main-content-view");
  if (mainContent && route.render) {
    const queryParams = new URLSearchParams(queryString || "");
    mainContent.innerHTML = "";
    route.render(mainContent, queryParams);
    
    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
