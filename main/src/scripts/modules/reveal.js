export function initRevealAnimation(selector) {
  const items = [...document.querySelectorAll(selector)];

  function reveal() {
    const viewportBottom = window.scrollY + window.innerHeight;
    items.forEach((item) => {
      const trigger = item.offsetTop + 80;
      if (viewportBottom > trigger) {
        item.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();
}
