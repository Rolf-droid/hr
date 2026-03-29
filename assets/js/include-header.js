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

  function bindMobileMenu() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var toggle = header.querySelector(".menu-toggle");
    var nav = header.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    var navLinks = nav.querySelectorAll(".main-nav__link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
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
      bindMobileMenu();

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
        "    <button type=\"button\" class=\"menu-toggle\" aria-label=\"Abrir menú\" aria-expanded=\"false\" aria-controls=\"main-nav-list\">",
        "      <span class=\"menu-toggle__bar\"></span>",
        "      <span class=\"menu-toggle__bar\"></span>",
        "      <span class=\"menu-toggle__bar\"></span>",
        "    </button>",
        "    <nav class=\"main-nav\">",
        "      <ul id=\"main-nav-list\">",
        "        <li><a href=\"nosotros.html\" class=\"main-nav__link main-nav__link--active\">Nosotros</a></li>",
        "        <li><a href=\"servicios.html\" class=\"main-nav__link\">Servicios</a></li>",
        "        <li><a href=\"proyecto.html\" class=\"main-nav__link\">Proyectos</a></li>",
        "        <li><a href=\"#clientes\" class=\"main-nav__link\">Nuestros Clientes</a></li>",
        "        <li><a href=\"galeria.html\" class=\"main-nav__link\">Galería de fotos</a></li>",
        "        <li><a href=\"curso.html\" class=\"main-nav__link\">Nuestros Cursos</a></li>",
        "        <li class=\"header-actions\">",
        "          <button type=\"button\" class=\"btn-search\" aria-label=\"Buscar\">",
        "            <span class=\"btn-search__icon\" aria-hidden=\"true\">",
        "              <img class=\"btn-search__img\" src=\"assets/img/home/lupa.png\" alt=\"\" width=\"18\" height=\"18\" decoding=\"async\" />",
        "            </span>",
        "          </button>",
        "          <a href=\"escribenos.html\" class=\"btn-primary btn-primary--header\">Escríbenos</a>",
        "        </li>",
        "      </ul>",
        "    </nav>",
        "  </div>",
        "</header>"
      ].join("");
      bindMobileMenu();
    });
})();

