/**
 * Carga e inserta el header reutilizable desde partials/header.html
 * Uso: añadir <div id="site-header-container"></div> donde debe ir el header
 *      y <script src="assets/js/include-header.js"></script> antes de </body>
 * En páginas dentro de subcarpetas:
 *   <div id="site-header-container" data-header-path="../partials/header.html"></div>
 * Opcional:
 *   data-active-href="#nosotros" para marcar el link activo en el menú
 */
(function () {
  var container = document.getElementById("site-header-container");
  if (!container) return;

  var headerPath = container.getAttribute("data-header-path") || "partials/header.html";
  var activeHref = container.getAttribute("data-active-href") || "";

  fetch(headerPath)
    .then(function (res) {
      return res.ok ? res.text() : Promise.reject(new Error("Header no encontrado"));
    })
    .then(function (html) {
      container.outerHTML = html;

      if (!activeHref) return;

      var activeLinks = document.querySelectorAll(".main-nav__link--active");
      activeLinks.forEach(function (l) {
        l.classList.remove("main-nav__link--active");
      });

      // Match por el href exacto (por ejemplo "#nosotros")
      var selector = '.main-nav__link[href="' + activeHref + '"]';
      var link = document.querySelector(selector);
      if (link) link.classList.add("main-nav__link--active");
    })
    .catch(function () {
      // Fallback mínimo en caso de fallo de fetch
      container.innerHTML = "<header class=\"site-header site-header--dark\"><div class=\"container header-inner\"><a href=\"#\" class=\"logo\" aria-label=\"HR Social Consulting - Inicio\"><img src=\"assets/img/home/logo.svg\" alt=\"HR Social Consulting - CONFIANZA\" /></a></div></header>";
    });
})();

