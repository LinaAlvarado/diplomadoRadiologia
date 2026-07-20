/* =========================================================================
   SERS EDUCA — Lógica de la landing del diplomado
   -------------------------------------------------------------------------
   Este archivo NO se edita para actualizar el horario.
   Para cambiar clases, temas, fechas o links → clases-data.js
   ========================================================================= */

(function () {
  "use strict";

  /* Zona horaria fija de Colombia. Las comparaciones NO dependen de la
     zona horaria del navegador de quien visita la página. */
  var ZONA_COLOMBIA = "America/Bogota";
  var OFFSET_COLOMBIA_MIN = -5 * 60; /* UTC-5, respaldo si Intl falla */

  /* ---------------------------------------------------------------------
     Utilidades de fecha
     --------------------------------------------------------------------- */

  /**
   * Devuelve el día calendario en Colombia de una fecha dada, como número
   * comparable AAAAMMDD (ej: 20260801). Así "hoy" es el mismo día para
   * todos los visitantes, estén donde estén.
   */
  function diaColombia(fecha) {
    try {
      var partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_COLOMBIA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(fecha); /* "2026-08-01" */
      return Number(partes.replace(/-/g, ""));
    } catch (e) {
      /* Respaldo: desplazamos manualmente a UTC-5 */
      var ms = fecha.getTime() + OFFSET_COLOMBIA_MIN * 60000;
      var d = new Date(ms);
      return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
    }
  }

  /** Texto legible de la fecha/hora en Colombia. Ej: "sáb 1 ago · 6:00 p. m." */
  function formatearFechaHora(fecha) {
    try {
      var dia = new Intl.DateTimeFormat("es-CO", {
        timeZone: ZONA_COLOMBIA,
        weekday: "short",
        day: "numeric",
        month: "short"
      }).format(fecha);

      var hora = new Intl.DateTimeFormat("es-CO", {
        timeZone: ZONA_COLOMBIA,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(fecha);

      return capitalizar(dia.replace(/\.$/, "")) + " · " + hora;
    } catch (e) {
      return fecha.toISOString().slice(0, 16).replace("T", " ");
    }
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  /**
   * Estado de una clase respecto al momento actual:
   *   "pasada" | "hoy" | "futura"
   */
  function estadoDeClase(fechaClase, ahora) {
    var diaClase = diaColombia(fechaClase);
    var diaHoy = diaColombia(ahora);

    if (diaClase === diaHoy) return "hoy";
    return diaClase < diaHoy ? "pasada" : "futura";
  }

  /* ---------------------------------------------------------------------
     Render
     --------------------------------------------------------------------- */

  /** Evita que un texto de clases-data.js rompa el HTML. */
  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function crearFila(clase, ahora) {
    var fecha = new Date(clase.fecha);
    var fechaValida = !isNaN(fecha.getTime());
    var estado = fechaValida ? estadoDeClase(fecha, ahora) : "futura";

    var fila = document.createElement("div");
    fila.className = "class-row class-row--" + estado;

    /* --- Tema (+ badge HOY) --- */
    var tema = document.createElement("div");
    tema.className = "class-row__tema";
    tema.innerHTML = escapar(clase.tema);
    if (estado === "hoy") {
      var badge = document.createElement("span");
      badge.className = "class-row__badge";
      badge.textContent = "Hoy";
      tema.appendChild(document.createTextNode(" "));
      tema.appendChild(badge);
    }

    /* --- Docente --- */
    var docente = document.createElement("div");
    docente.className = "class-row__docente";
    docente.innerHTML =
      '<span class="class-row__etiqueta">Docente</span>' + escapar(clase.docente);

    /* --- Hora --- */
    var hora = document.createElement("div");
    hora.className = "class-row__hora";
    hora.innerHTML =
      '<span class="class-row__etiqueta">Hora</span>' +
      (fechaValida ? escapar(formatearFechaHora(fecha)) : "Por definir");

    /* --- Acceso --- */
    var acceso = document.createElement("div");
    acceso.className = "class-row__acceso";

    var hayLink = typeof clase.link === "string" && clase.link.trim() !== "";

    if (estado === "pasada" || !hayLink) {
      var inactivo = document.createElement("span");
      inactivo.className = "class-row__link class-row__link--disabled";
      inactivo.textContent = estado === "pasada" ? "Finalizada" : "Próximamente";
      acceso.appendChild(inactivo);
    } else {
      var link = document.createElement("a");
      link.className = "class-row__link";
      link.href = clase.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = estado === "hoy" ? "Entrar ahora" : "Ver link";
      link.setAttribute("aria-label", "Acceder a la clase: " + clase.tema);
      acceso.appendChild(link);
    }

    fila.appendChild(tema);
    fila.appendChild(docente);
    fila.appendChild(hora);
    fila.appendChild(acceso);
    return fila;
  }

  function renderHorario() {
    var contenedor = document.getElementById("schedule-body");
    if (!contenedor) return;

    var lista = typeof clases !== "undefined" && Array.isArray(clases) ? clases.slice() : [];

    if (lista.length === 0) {
      contenedor.innerHTML =
        '<p class="schedule__empty">El horario se publicará muy pronto.</p>';
      return;
    }

    /* Orden cronológico: el orden en clases-data.js no importa */
    lista.sort(function (a, b) {
      return new Date(a.fecha) - new Date(b.fecha);
    });

    var ahora = new Date();
    var fragmento = document.createDocumentFragment();

    lista.forEach(function (clase) {
      fragmento.appendChild(crearFila(clase, ahora));
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(fragmento);
  }

  /** Escribe la fecha de inicio del diplomado en la tarjeta de datos clave. */
  function renderFechaInicio() {
    var destino = document.querySelector("[data-fecha-inicio]");
    if (!destino) return;

    if (typeof fechaInicioDiplomado === "string" && fechaInicioDiplomado.trim() !== "") {
      destino.textContent = fechaInicioDiplomado;
    } else {
      destino.textContent = "Próximamente";
    }
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  function iniciar() {
    renderFechaInicio();
    renderHorario();

    /* Revisamos cada minuto para que el estado cambie solo al pasar la
       medianoche en Colombia, sin necesidad de recargar la página. */
    setInterval(renderHorario, 60000);

    /* También al volver a la pestaña tras un rato */
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) renderHorario();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
