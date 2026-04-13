(function () {
  "use strict";

  var WEB3FORMS_URL = "https://api.web3forms.com/submit";

  var form = document.getElementById("escribenos-form");
  if (!form || !(form instanceof HTMLFormElement)) return;

  var accessKey =
    typeof window.HR_WEB3FORMS_ACCESS_KEY === "string"
      ? window.HR_WEB3FORMS_ACCESS_KEY.trim()
      : "";

  var statusEl = document.getElementById("escribenos-form-status");
  var submitBtn = form.querySelector('[type="submit"]');

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "escribenos-form__status escribenos-form__status--" + type;
    statusEl.hidden = !message;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");

    if (!accessKey) {
      setStatus(
        "error",
        "Falta configurar la clave de Web3Forms en la página (HR_WEB3FORMS_ACCESS_KEY)."
      );
      return;
    }

    var fd = new FormData(form);
    var nombre = String(fd.get("nombre") || "").trim();
    var email = String(fd.get("email") || "").trim();
    var tema = String(fd.get("tema") || "").trim();
    var mensaje = String(fd.get("mensaje") || "").trim();

    if (!nombre || !email || !tema || !mensaje) {
      setStatus("error", "Completa todos los campos obligatorios.");
      return;
    }

    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

    var payload = {
      access_key: accessKey,
      name: nombre,
      email: email,
      subject: "[Escríbenos HR] " + tema,
      message: mensaje,
      replyto: email,
      from_name: nombre,
    };

    fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        if (r.data && r.data.success === true) {
          setStatus("success", "Gracias. Tu mensaje fue enviado correctamente.");
          form.reset();
        } else {
          var msg =
            (r.data && (r.data.message || r.data.error)) ||
            "No se pudo enviar. Intenta de nuevo en unos minutos.";
          setStatus("error", String(msg));
        }
      })
      .catch(function () {
        setStatus("error", "Error de conexión. Comprueba tu red e intenta otra vez.");
      })
      .finally(function () {
        if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
      });
  });
})();
