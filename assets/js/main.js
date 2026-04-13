document.addEventListener("DOMContentLoaded", () => {
  // Año en el footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  // Hero slider: 3 banners, dots y autoplay
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-slider__dot");
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 6000;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    slides.forEach((s, i) => s.classList.toggle("hero-slide--active", i === currentIndex));
    dots.forEach((d, i) => d.classList.toggle("hero-slider__dot--active", i === currentIndex));
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoplay();
    });
  });

  if (totalSlides > 1) {
    resetAutoplay();
  }
});

