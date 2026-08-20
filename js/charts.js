// charts.js — Chart.js Helper & Theme Configuration

import { getTheme, onThemeChange } from "./theme.js";

const activeCharts = new Map();

function getChartColors() {
  const isDark = getTheme() === "dark";
  return {
    isDark,
    textColor: isDark ? "#A7ADBA" : "#5B6270",
    gridColor: isDark ? "rgba(42, 46, 56, 0.7)" : "rgba(228, 231, 235, 0.7)",
    primaryAccent: isDark ? "#3B82F6" : "#2563EB",
    primaryAccentSubtle: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.12)",
    secondaryAccent: isDark ? "#14B8A6" : "#0D9488",
    warning: isDark ? "#F59E0B" : "#D97706",
    success: isDark ? "#22C55E" : "#16A34A",
    danger: isDark ? "#EF4444" : "#DC2626",
    tooltipBg: isDark ? "#1E212B" : "#1A1D23",
    tooltipText: "#FFFFFF",
    donutColors: isDark
      ? ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]
      : ["#2563EB", "#059669", "#D97706", "#7C3AED"]
  };
}

export function createLineTrendChart(canvasId, labels, dataTrips, dataVolume) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const colors = getChartColors();
  const ctx = canvas.getContext("2d");

  const chart = new window.Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Volume Terkirim (m³)",
          data: dataVolume,
          borderColor: colors.primaryAccent,
          backgroundColor: colors.primaryAccentSubtle,
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.primaryAccent,
          yAxisID: "y"
        },
        {
          label: "Jumlah Rit",
          data: dataTrips,
          borderColor: colors.secondaryAccent,
          backgroundColor: "transparent",
          borderDash: [5, 5],
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: colors.secondaryAccent,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: colors.textColor,
            font: { family: "Inter", size: 12, weight: "500" },
            boxWidth: 14,
            usePointStyle: true,
            pointStyle: "circle"
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          padding: 10,
          cornerRadius: 8,
          borderColor: colors.gridColor,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: colors.gridColor, drawBorder: false },
          ticks: { color: colors.textColor, font: { family: "Inter", size: 11 } }
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Volume (m³)",
            color: colors.textColor,
            font: { family: "Inter", size: 11 }
          },
          grid: { color: colors.gridColor, drawBorder: false },
          ticks: { color: colors.textColor, font: { family: "Inter", size: 11 } }
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Total Rit",
            color: colors.textColor,
            font: { family: "Inter", size: 11 }
          },
          grid: { drawOnChartArea: false },
          ticks: { color: colors.textColor, font: { family: "Inter", size: 11 } }
        }
      }
    }
  });

  activeCharts.set(canvasId, { chart, type: "lineTrend", params: [labels, dataTrips, dataVolume] });
  return chart;
}

export function createDoughnutDistributionChart(canvasId, labels, data) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const colors = getChartColors();
  const ctx = canvas.getContext("2d");

  const chart = new window.Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors.donutColors.slice(0, labels.length),
          borderWidth: colors.isDark ? 2 : 1,
          borderColor: colors.isDark ? "#1E212B" : "#FFFFFF"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.textColor,
            font: { family: "Inter", size: 11 },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${context.label}: ${value.toLocaleString("id-ID")} m³ (${pct}%)`;
            }
          }
        }
      }
    }
  });

  activeCharts.set(canvasId, { chart, type: "doughnut", params: [labels, data] });
  return chart;
}

export function createBarDestinationChart(canvasId, labels, dataReceived, dataTarget) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const colors = getChartColors();
  const ctx = canvas.getContext("2d");

  const chart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Volume Diterima (m³)",
          data: dataReceived,
          backgroundColor: colors.primaryAccent,
          borderRadius: 6
        },
        {
          label: "Target Kapasitas (m³)",
          data: dataTarget,
          backgroundColor: colors.gridColor,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: colors.textColor,
            font: { family: "Inter", size: 11 }
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textColor, font: { family: "Inter", size: 11 } }
        },
        y: {
          grid: { color: colors.gridColor, drawBorder: false },
          ticks: { color: colors.textColor, font: { family: "Inter", size: 11 } }
        }
      }
    }
  });

  activeCharts.set(canvasId, { chart, type: "barDestination", params: [labels, dataReceived, dataTarget] });
  return chart;
}

export function destroyChart(canvasId) {
  if (activeCharts.has(canvasId)) {
    const item = activeCharts.get(canvasId);
    if (item.chart) {
      item.chart.destroy();
    }
    activeCharts.delete(canvasId);
  }
}

export function destroyAllCharts() {
  activeCharts.forEach((item) => {
    if (item.chart) {
      item.chart.destroy();
    }
  });
  activeCharts.clear();
}

// Automatically re-create registered charts on theme change
onThemeChange(() => {
  const chartEntries = Array.from(activeCharts.entries());
  chartEntries.forEach(([id, item]) => {
    if (item.type === "lineTrend") {
      createLineTrendChart(id, ...item.params);
    } else if (item.type === "doughnut") {
      createDoughnutDistributionChart(id, ...item.params);
    } else if (item.type === "barDestination") {
      createBarDestinationChart(id, ...item.params);
    }
  });
});
