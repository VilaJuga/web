export function initBackToTop(backTopButton) {
  function onScroll() {
    backTopButton?.classList.toggle("show", window.scrollY > 360);
  }

  backTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", onScroll);
  onScroll();
}
