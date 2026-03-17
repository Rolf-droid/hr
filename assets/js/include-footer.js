/**
 * Carga e inserta el footer reutilizable desde partials/footer.html
 * Uso: añadir <div id="site-footer-container"></div> donde debe ir el footer
 *      y <script src="assets/js/include-footer.js"></script> antes de </body>
 * En páginas dentro de subcarpetas: <div id="site-footer-container" data-footer-path="../partials/footer.html"></div>
 */
(function () {
  var container = document.getElementById("site-footer-container");
  if (!container) return;

  var footerPath = container.getAttribute("data-footer-path") || "partials/footer.html";

  fetch(footerPath)
    .then(function (res) { return res.ok ? res.text() : Promise.reject(new Error("Footer no encontrado")); })
    .then(function (html) {
      container.outerHTML = html;
      var yearEl = document.getElementById("footer-year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    })
    .catch(function () {
      container.innerHTML = "<footer class=\"site-footer\"><div class=\"container\"><p>© " + new Date().getFullYear() + " HR Social Consulting.</p></div></footer>";
    });
})();
