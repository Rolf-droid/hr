/**
 * Carga e inserta el header reutilizable desde partials/header.html
 * Uso: añadir <div id="site-header-container"></div> donde debe ir el header
 *      y <script src="assets/js/include-header.js"></script> antes de </body>
 * En páginas dentro de subcarpetas:
 *   <div id="site-header-container" data-header-path="../partials/header.html"></div>
 * Opcional:
 *   data-active-href="nosotros.html" para marcar el link activo en el menú
 */
(function () {
  var hrefMap = {
    "#nosotros": "nosotros.html",
    "#servicios": "servicios.html",
    "#proyectos": "proyecto.html",
    "#galeria": "galeria.html",
    "#curso": "curso.html",
    "#cursos": "curso.html",
    "#escribenos": "escribenos.html"
  };

  function normalizeHref(href) {
    return hrefMap[href] || href;
  }

  var container = document.getElementById("site-header-container");
  if (!container) return;

  var headerPath = container.getAttribute("data-header-path") || "partials/header.html";
  var activeHref = normalizeHref(container.getAttribute("data-active-href") || "");

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

      // Match por el href exacto (por ejemplo "nosotros.html")
      var selector = '.main-nav__link[href="' + activeHref + '"]';
      var link = document.querySelector(selector);
      if (link) link.classList.add("main-nav__link--active");
    })
    .catch(function () {
      // Fallback en caso de fallo de fetch (por ejemplo, apertura directa por file://)
      container.innerHTML = [
        "<header class=\"site-header\">",
        "  <div class=\"container header-inner\">",
        "    <a href=\"index.html\" class=\"logo\" aria-label=\"HR Social Consulting - Inicio\">",
        "      <img src=\"assets/img/home/logo.svg\" alt=\"HR Social Consulting - CONFIANZA\" />",
        "    </a>",
        "    <nav class=\"main-nav\">",
        "      <ul>",
        "        <li><a href=\"nosotros.html\" class=\"main-nav__link main-nav__link--active\">Nosotros</a></li>",
        "        <li><a href=\"servicios.html\" class=\"main-nav__link\">Servicios</a></li>",
        "        <li><a href=\"proyecto.html\" class=\"main-nav__link\">Proyectos</a></li>",
        "        <li><a href=\"#clientes\" class=\"main-nav__link\">Nuestros Clientes</a></li>",
        "        <li><a href=\"galeria.html\" class=\"main-nav__link\">Galería de fotos</a></li>",
        "        <li><a href=\"curso.html\" class=\"main-nav__link\">Nuestros Cursos</a></li>",
        "        <li class=\"header-actions\">",
        "          <button type=\"button\" class=\"btn-search\" aria-label=\"Buscar\">",
        "            <span class=\"btn-search__icon\" aria-hidden=\"true\">",
        "              <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" role=\"img\" focusable=\"false\">",
        "                <path fill=\"currentColor\" d=\"M10 2a8 8 0 1 1 5.293 14l4.353 4.353a1 1 0 0 1-1.414 1.414L13.879 17.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Z\" />",
        "              </svg>",
        "            </span>",
        "          </button>",
        "          <a href=\"escribenos.html\" class=\"btn-primary btn-primary--header\">Escríbenos</a>",
        "        </li>",
        "      </ul>",
        "    </nav>",
        "  </div>",
        "</header>"
      ].join("");
    });
})();

