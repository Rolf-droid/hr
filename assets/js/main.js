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

  // Escríbenos: enviar al chat de WhatsApp vía API (enlace HTML / redirección)
  const escribenosForm = document.querySelector(".escribenos-form");
  if (escribenosForm) {
    const waPhone = "51962378581";
    escribenosForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const tema = document.getElementById("tema")?.value.trim() || "";
      const mensaje = document.getElementById("mensaje")?.value.trim() || "";
      const parts = [
        "Hola HR Social Consulting, escribo desde el formulario web:",
        nombre && `Nombre: ${nombre}`,
        email && `Email: ${email}`,
        tema && `Tema: ${tema}`,
        mensaje && `Mensaje:\n${mensaje}`
      ].filter(Boolean);
      const text = parts.join("\n");
      window.location.href =
        "https://api.whatsapp.com/send?phone=" + waPhone + "&text=" + encodeURIComponent(text);
    });
  }
});

