// theme.js — Theme Management (Light / Dark Mode)

const THEME_KEY = "fleet_monitoring_theme";
const listeners = [];

export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  setTheme(savedTheme, false);

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      setTheme(next, true);
    });
  }
}

export function setTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }
  updateThemeIcon(theme);
  listeners.forEach((callback) => callback(theme));
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

export function onThemeChange(callback) {
  listeners.push(callback);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) {
    if (theme === "dark") {
      icon.setAttribute("data-lucide", "sun");
    } else {
      icon.setAttribute("data-lucide", "moon");
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}
