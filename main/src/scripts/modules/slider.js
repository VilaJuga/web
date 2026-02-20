export function initSlider(heroRoot) {
  const slides = [...heroRoot.querySelectorAll(".hero-slide")];
  const dotsWrap = heroRoot.querySelector(".hero-dots");
  const prevBtn = heroRoot.querySelector(".hero-arrow.prev");
  const nextBtn = heroRoot.querySelector(".hero-arrow.next");

  let currentSlide = 0;
  let autoSlide;

  if (!slides.length || !dotsWrap) {
    return;
  }

  function setSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  }

  function buildDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.ariaLabel = `Anar a la diapositiva ${i + 1}`;
      dot.addEventListener("click", () => {
        setSlide(i);
        resetAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function startAutoplay() {
    autoSlide = setInterval(() => setSlide(currentSlide + 1), 6000);
  }

  function resetAutoplay() {
    clearInterval(autoSlide);
    startAutoplay();
  }

  nextBtn?.addEventListener("click", () => {
    setSlide(currentSlide + 1);
    resetAutoplay();
  });

  prevBtn?.addEventListener("click", () => {
    setSlide(currentSlide - 1);
    resetAutoplay();
  });

  buildDots();
  setSlide(0);
  startAutoplay();
}
