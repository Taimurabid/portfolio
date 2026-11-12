export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs inline in <head> before first paint. It resolves the theme from a saved
 * choice, falling back to the system setting, and writes it to
 * <html data-theme>. With no saved choice it keeps following system changes.
 * It also sets <html data-js> so CSS knows scroll-reveal JS is running.
 * Kept dependency-free and tiny on purpose: it blocks rendering.
 */
export const themeScript = `(() => {
  const root = document.documentElement;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const saved = () => { try { return localStorage.getItem("${THEME_STORAGE_KEY}"); } catch { return null; } };
  const apply = () => {
    const s = saved();
    root.dataset.theme = s === "light" || s === "dark" ? s : mq.matches ? "dark" : "light";
  };
  apply();
  root.dataset.js = "";
  mq.addEventListener("change", () => { if (!saved()) apply(); });
})();`;
