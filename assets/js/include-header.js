/**
 * Carga e inserta el header reutilizable desde partials/header.html
 * Uso: añadir <div id="site-header-container"></div> donde debe ir el header
 *      y <script src="assets/js/include-header.js"></script> antes de </body>
 * En páginas dentro de subcarpetas:
 *   <div id="site-header-container" data-header-path="../partials/header.html"></div>
 * Opcional:
 *   data-active-href="nosotros" (o #nosotros) para marcar el link activo en el menú
 */
(function () {
  var hrefMap = {
    "#nosotros": "nosotros",
    "#servicios": "servicios",
    "#proyectos": "proyecto",
    "#galeria": "galeria",
    "#curso": "curso",
    "#cursos": "curso",
    "#escribenos": "escribenos"
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

  var SITE_PAGES = [
    { title: "Inicio", href: "./", kw: "inicio principal home portada" },
    { title: "Nosotros", href: "nosotros", kw: "nosotros empresa equipo quienes" },
    { title: "Servicios", href: "servicios", kw: "servicios consultoría asesoría" },
    { title: "Proyectos", href: "proyecto", kw: "proyectos trabajo" },
    { title: "Nuestros Clientes", href: "./#clientes", kw: "clientes logos empresas" },
    { title: "Galería de fotos", href: "galeria", kw: "galería fotos imágenes" },
    { title: "Nuestros Cursos", href: "curso", kw: "cursos capacitación formación" },
    { title: "Escríbenos", href: "escribenos", kw: "escribenos contacto escribir mensaje formulario" }
  ];

  function bindSiteSearch() {
    var root = document.querySelector(".header-site-search");
    if (!root) return;

    var btn = root.querySelector(".btn-search");
    var panel = root.querySelector(".header-site-search__panel");
    var input = root.querySelector(".header-site-search__input");
    var list = root.querySelector(".header-site-search__results");
    var waLink = root.querySelector(".header-site-search__wa");
    var phone = (root.getAttribute("data-whatsapp-phone") || "51962378581").replace(/\D/g, "");

    if (!btn || !panel || !input || !list) return;

    if (waLink && phone) {
      var preset = "Hola, escribo desde la web de HR Social Consulting.";
      waLink.href =
        "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(preset);
    }

    function normalize(s) {
      return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function filterPages(q) {
      var nq = normalize(q).trim();
      if (!nq) return SITE_PAGES.slice();
      return SITE_PAGES.filter(function (p) {
        var hay = normalize(p.title + " " + p.kw + " " + p.href);
        return hay.indexOf(nq) !== -1;
      });
    }

    function renderResults() {
      var items = filterPages(input.value);
      list.innerHTML = "";
      if (items.length === 0) {
        var empty = document.createElement("li");
        empty.className = "header-site-search__empty";
        empty.setAttribute("role", "presentation");
        empty.textContent = "No hay páginas que coincidan.";
        list.appendChild(empty);
        return;
      }
      items.forEach(function (p) {
        var li = document.createElement("li");
        li.className = "header-site-search__result";
        var a = document.createElement("a");
        a.href = p.href;
        a.textContent = p.title;
        a.setAttribute("role", "option");
        a.addEventListener("click", function () {
          closePanel();
          input.value = "";
          renderResults();
        });
        li.appendChild(a);
        list.appendChild(li);
      });
    }

    function openPanel() {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      renderResults();
      input.focus();
    }

    function closePanel() {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    function togglePanel() {
      if (panel.hidden) openPanel();
      else closePanel();
    }

    input.addEventListener("input", renderResults);

    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var first = list.querySelector(".header-site-search__result a");
      if (first) {
        e.preventDefault();
        window.location.href = first.getAttribute("href");
        closePanel();
        input.value = "";
        renderResults();
      }
    });

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      togglePanel();
    });

    document.addEventListener("click", function (e) {
      if (!panel.hidden && !root.contains(e.target)) {
        closePanel();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        closePanel();
        btn.focus();
      }
    });
  }

  /**
   * El header se inyecta de forma asíncrona: el scroll al #fragmento ocurre antes
   * y la altura real del menú desplaza las secciones. Re-centramos tras el layout.
   */
  function scrollToHashAfterLayout() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    function doScroll() {
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(doScroll);
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
      bindSiteSearch();

      if (!activeHref) return;

      var activeLinks = document.querySelectorAll(".main-nav__link--active");
      activeLinks.forEach(function (l) {
        l.classList.remove("main-nav__link--active");
      });

      // Match por el href exacto (por ejemplo "nosotros")
      var selector = '.main-nav__link[href="' + activeHref + '"]';
      var link = document.querySelector(selector);
      if (link) link.classList.add("main-nav__link--active");

      scrollToHashAfterLayout();
    })
    .catch(function () {
      // Fallback en caso de fallo de fetch (por ejemplo, apertura directa por file://)
      container.innerHTML = [
        "<header class=\"site-header\">",
        "  <div class=\"container header-inner\">",
        "    <a href=\"./\" class=\"logo\" aria-label=\"HR Social Consulting - Inicio\">",
        "      <img src=\"assets/img/home/logo.svg\" alt=\"HR Social Consulting - CONFIANZA\" />",
        "    </a>",
        "    <button type=\"button\" class=\"menu-toggle\" aria-label=\"Abrir menú\" aria-expanded=\"false\" aria-controls=\"main-nav-list\">",
        "      <span class=\"menu-toggle__bar\"></span>",
        "      <span class=\"menu-toggle__bar\"></span>",
        "      <span class=\"menu-toggle__bar\"></span>",
        "    </button>",
        "    <nav class=\"main-nav\">",
        "      <ul id=\"main-nav-list\">",
        "        <li><a href=\"nosotros\" class=\"main-nav__link main-nav__link--active\">Nosotros</a></li>",
        "        <li><a href=\"servicios\" class=\"main-nav__link\">Servicios</a></li>",
        "        <li><a href=\"proyecto\" class=\"main-nav__link\">Proyectos</a></li>",
        "        <li><a href=\"./#clientes\" class=\"main-nav__link\">Nuestros Clientes</a></li>",
        "        <li><a href=\"galeria\" class=\"main-nav__link\">Galería de fotos</a></li>",
        "        <li><a href=\"curso\" class=\"main-nav__link\">Nuestros Cursos</a></li>",
        "        <li class=\"header-actions\">",
        "          <div class=\"header-site-search\" data-whatsapp-phone=\"51962378581\">",
        "            <button type=\"button\" class=\"btn-search\" id=\"site-search-toggle\" aria-expanded=\"false\" aria-controls=\"site-search-panel\" aria-label=\"Buscar páginas del sitio\">",
        "              <span class=\"btn-search__icon\" aria-hidden=\"true\">",
        "                <img class=\"btn-search__img\" src=\"assets/img/home/lupa.png\" alt=\"\" width=\"18\" height=\"18\" decoding=\"async\" />",
        "              </span>",
        "            </button>",
        "            <div id=\"site-search-panel\" class=\"header-site-search__panel\" role=\"region\" aria-labelledby=\"site-search-toggle\" hidden>",
        "              <input type=\"search\" class=\"header-site-search__input\" id=\"site-search-input\" maxlength=\"120\" autocomplete=\"off\" placeholder=\"Buscar página…\" aria-label=\"Texto para filtrar páginas\" aria-controls=\"site-search-results\" />",
        "              <ul id=\"site-search-results\" class=\"header-site-search__results\" role=\"listbox\" aria-label=\"Resultados\"></ul>",
        "              <p class=\"header-site-search__wa-wrap\"><a class=\"header-site-search__wa\" href=\"https://api.whatsapp.com/send?phone=51962378581&amp;text=Hola\" target=\"_blank\" rel=\"noopener noreferrer\">Escríbenos por WhatsApp</a></p>",
        "            </div>",
        "          </div>",
        "          <a href=\"escribenos\" class=\"btn-primary btn-primary--header\">Escríbenos</a>",
        "        </li>",
        "      </ul>",
        "    </nav>",
        "  </div>",
        "</header>"
      ].join("");
      bindMobileMenu();
      bindSiteSearch();
      scrollToHashAfterLayout();
    });
})();

