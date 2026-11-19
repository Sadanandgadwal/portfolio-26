/** Scrolls to the top and returns keyboard focus to the first header link (skip-link friendly). */
export function scrollToTop(reduceMotion: boolean) {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
}
