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

  /* Iconos (SVG en línea, sin archivos externos) */
  var ICONO_ACTUALIZADO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/>' +
    '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>';

  var ICONO_PLAY =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" ' +
    'style="width:12px;height:12px;flex:none"><path d="M8 5.5v13l11-6.5z"/></svg>';

  var ICONO_CANDADO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
    'style="width:12px;height:12px;flex:none">' +
    '<rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/>' +
    '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>';

  /* ---------------------------------------------------------------------
     Venta / WhatsApp
     --------------------------------------------------------------------- */

  /** Número y mensaje salen de clases-data.js; aquí solo hay respaldos. */
  function numeroWhatsApp() {
    return typeof WHATSAPP_NUMERO !== "undefined" && String(WHATSAPP_NUMERO).trim() !== ""
      ? String(WHATSAPP_NUMERO).replace(/[^\d]/g, "")
      : "573022262221";
  }

  /** URL de WhatsApp con el mensaje ya escrito. */
  function enlaceWhatsApp(mensajeExtra) {
    var base = typeof WHATSAPP_MENSAJE !== "undefined" && String(WHATSAPP_MENSAJE).trim() !== ""
      ? String(WHATSAPP_MENSAJE)
      : "Hola, quiero información del diplomado.";
    var texto = mensajeExtra ? base + " " + mensajeExtra : base;
    return "https://wa.me/" + numeroWhatsApp() + "?text=" + encodeURIComponent(texto);
  }

  /** URL de WhatsApp con un mensaje completo propio (sin el texto base). */
  function enlaceWhatsAppMensaje(mensaje) {
    var texto = mensaje && String(mensaje).trim() !== ""
      ? String(mensaje)
      : (typeof WHATSAPP_MENSAJE !== "undefined" ? String(WHATSAPP_MENSAJE) : "Hola");
    return "https://wa.me/" + numeroWhatsApp() + "?text=" + encodeURIComponent(texto);
  }

  /** Cuántas clases quedan abiertas al público (las primeras del cronograma). */
  function cuantasGratis() {
    return typeof CLASES_GRATIS === "number" && CLASES_GRATIS >= 0 ? CLASES_GRATIS : 7;
  }

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

  /** Texto legible de la fecha/hora en Colombia. Ej: "Sáb, 1 de ago · 6:00 p. m." */
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

  /** "2026-07-18" → "18 de julio" (para el texto "Actualizado el ...") */
  function formatearFechaCorta(texto) {
    var partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(texto).trim());
    if (!partes) return String(texto);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                 "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var mes = meses[Number(partes[2]) - 1];
    return mes ? Number(partes[3]) + " de " + mes : String(texto);
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  /**
   * Estado de una clase respecto al momento actual:
   *   "pasada" | "hoy" | "futura"
   */
  function estadoDeClase(clase, fechaClase, ahora) {
    /* Modo demo: fuerza el resaltado de "HOY" para revisar el diseño.
       Se activa/desactiva con MODO_DEMO en clases-data.js */
    if (typeof MODO_DEMO !== "undefined" && MODO_DEMO === true && clase.demoHoy === true) {
      return "hoy";
    }

    /* Interruptor manual: marca la clase como terminada aunque sea "hoy". */
    if (clase.finalizada === true) return "pasada";

    var diaClase = diaColombia(fechaClase);
    var diaHoy = diaColombia(ahora);

    if (diaClase === diaHoy) return "hoy";
    return diaClase < diaHoy ? "pasada" : "futura";
  }

  /* ---------------------------------------------------------------------
     Render del horario
     --------------------------------------------------------------------- */

  /** Evita que un texto de clases-data.js rompa el HTML. */
  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** true si el campo existe y tiene contenido real */
  function tieneTexto(valor) {
    return typeof valor === "string" && valor.trim() !== "";
  }

  function crearFila(clase, ahora, bloqueada) {
    var fecha = new Date(clase.fecha);
    var fechaValida = !isNaN(fecha.getTime());
    var estado = fechaValida ? estadoDeClase(clase, fecha, ahora) : "futura";
    var fueModificada = tieneTexto(clase.cambio);
    var acceso = calcularAcceso(clase, estado, bloqueada);

    var fila = document.createElement("div");
    fila.className = "class-row class-row--" + estado +
      (bloqueada ? " class-row--bloqueada" : "") +
      (fueModificada ? " class-row--actualizada" : "") +
      /* Es hoy pero aún sin link: se atenúa el resaltado verde */
      (estado === "hoy" && !acceso.activo ? " class-row--sin-link" : "");

    /* --- Tema (+ badges) --- */
    var tema = document.createElement("div");
    tema.className = "class-row__tema";
    tema.innerHTML = escapar(clase.tema);

    if (!bloqueada && estado === "hoy") {
      var badgeHoy = document.createElement("span");
      badgeHoy.className = "class-row__badge";
      badgeHoy.textContent = "Hoy";
      tema.appendChild(document.createTextNode(" "));
      tema.appendChild(badgeHoy);
    }

    if (fueModificada) {
      var badgeUpd = document.createElement("span");
      badgeUpd.className = "class-row__badge class-row__badge--actualizado";
      badgeUpd.innerHTML = ICONO_ACTUALIZADO + "Actualizado";
      if (tieneTexto(clase.cambioFecha)) {
        badgeUpd.title = "Actualizado el " + formatearFechaCorta(clase.cambioFecha);
      }
      tema.appendChild(document.createTextNode(" "));
      tema.appendChild(badgeUpd);
    }

    /* --- Docente ---
       Si todavía no hay docente asignado, la celda va vacía. Así en celular
       no queda la etiqueta "DOCENTE" sola, sin nombre debajo. */
    var docente = document.createElement("div");
    docente.className = "class-row__docente";
    if (tieneTexto(clase.docente)) {
      docente.innerHTML =
        '<span class="class-row__etiqueta">Docente</span>' + escapar(clase.docente);
    }

    /* --- Hora (+ nota de qué cambió) ---
       En las clases bloqueadas sin fecha la celda va vacía: el "Por definir"
       no aporta nada y le resta fuerza al botón de desbloquear. */
    var hora = document.createElement("div");
    hora.className = "class-row__hora";
    if (fechaValida) {
      hora.innerHTML =
        '<span class="class-row__etiqueta">Hora</span>' +
        '<span class="class-row__hora-valor">' +
          escapar(formatearFechaHora(fecha)) + '</span>';
    } else if (!bloqueada) {
      hora.innerHTML = '<span class="class-row__etiqueta">Hora</span>Por definir';
    }

    if (fueModificada) {
      var nota = document.createElement("span");
      nota.className = "class-row__cambio";
      nota.textContent = clase.cambio;

      if (tieneTexto(clase.cambioFecha)) {
        var cuando = document.createElement("span");
        cuando.className = "class-row__cambio-fecha";
        cuando.textContent = "Actualizado el " + formatearFechaCorta(clase.cambioFecha);
        nota.appendChild(cuando);
      }
      hora.appendChild(nota);
    }

    /* --- Acceso --- */
    var celdaAcceso = document.createElement("div");
    celdaAcceso.className = "class-row__acceso";
    celdaAcceso.appendChild(crearBotonAcceso(clase, acceso));

    fila.appendChild(tema);
    fila.appendChild(docente);
    fila.appendChild(hora);
    fila.appendChild(celdaAcceso);
    return fila;
  }

  /**
   * Decide qué hacer con el botón de una clase. Reglas:
   *
   *   FUTURA  → siempre "Próximamente" (inactivo).
   *             El link NO se muestra antes del día de la clase, aunque ya
   *             esté cargado en clases-data.js.
   *   HOY     → "Entrar ahora" (verde, activo) SOLO si ya hay link.
   *             Si todavía no hay link → "Link pronto" (inactivo).
   *   PASADA  → "Finalizada" (etiqueta gris inactiva). Las clases en vivo no
   *             dejan grabación abierta.
   *
   *   BLOQUEADA (fuera de las primeras CLASES_GRATIS) → manda a WhatsApp,
   *             sin importar la fecha.
   *
   * Devuelve { texto, url, activo, tipo }
   */
  function calcularAcceso(clase, estado, bloqueada) {
    if (bloqueada) {
      return {
        texto: "Desbloquear",
        url: enlaceWhatsApp(),
        activo: true,
        tipo: "bloqueada"
      };
    }

    if (estado === "pasada") {
      return { texto: "Finalizada", url: "", activo: false, tipo: "finalizada" };
    }

    if (estado === "hoy") {
      return tieneTexto(clase.link)
        ? { texto: "Entrar ahora", url: clase.link, activo: true, tipo: "vivo" }
        : { texto: "Link pronto", url: "", activo: false, tipo: "vivo" };
    }

    /* Futura: nunca se muestra el link todavía */
    return { texto: "Próximamente", url: "", activo: false, tipo: "futura" };
  }

  /** Botón de la columna "Acceso" de la tabla. */
  function crearBotonAcceso(clase, acceso) {
    if (!acceso.activo) {
      var inactivo = document.createElement("span");
      inactivo.className = "class-row__link class-row__link--disabled";
      inactivo.textContent = acceso.texto;
      return inactivo;
    }

    var link = document.createElement("a");
    link.className = "class-row__link" +
      (acceso.tipo === "grabacion" ? " class-row__link--grabacion" : "") +
      (acceso.tipo === "bloqueada" ? " class-row__link--bloqueada" : "");
    link.href = acceso.url;
    link.target = "_blank";
    link.rel = "noopener";

    if (acceso.tipo === "grabacion") {
      link.innerHTML = ICONO_PLAY + acceso.texto;
      link.setAttribute("aria-label", "Ver grabación de la clase: " + clase.tema);
    } else if (acceso.tipo === "bloqueada") {
      link.innerHTML = ICONO_CANDADO + acceso.texto;
      link.setAttribute("aria-label",
        "Escríbenos por WhatsApp para acceder a la clase: " + clase.tema);
    } else {
      link.textContent = acceso.texto;
      link.setAttribute("aria-label", "Acceder a la clase: " + clase.tema);
    }
    return link;
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
    var gratis = cuantasGratis();
    var bloqueadas = Math.max(0, lista.length - gratis);

    lista.forEach(function (clase, i) {
      /* El corte va después de la última clase abierta, solo si de verdad
         quedan clases bloqueadas debajo. */
      if (i === gratis && bloqueadas > 0) {
        fragmento.appendChild(crearCorteVenta(bloqueadas));
      }
      fragmento.appendChild(crearFila(clase, ahora, i >= gratis));
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(fragmento);
  }

  /**
   * Franja que separa las clases abiertas de las del diplomado completo.
   * Es el punto de venta principal de la tabla.
   */
  function crearCorteVenta(bloqueadas) {
    var corte = document.createElement("div");
    corte.className = "schedule__corte";

    var texto = document.createElement("div");
    texto.className = "schedule__corte-texto";

    var titulo = document.createElement("p");
    titulo.className = "schedule__corte-titulo";
    titulo.innerHTML = ICONO_CANDADO +
      "Hasta aquí llegan las clases en vivo abiertas";

    var detalle = document.createElement("p");
    detalle.className = "schedule__corte-detalle";
    detalle.textContent = "Inscríbete al diplomado y desbloquea las " + bloqueadas +
      " clases restantes con quizes interactivos + certificado.";

    texto.appendChild(titulo);
    texto.appendChild(detalle);

    var cta = document.createElement("a");
    cta.className = "schedule__corte-cta";
    cta.href = enlaceWhatsApp();
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.textContent = "Desbloquear diplomado";

    corte.appendChild(texto);
    corte.appendChild(cta);
    return corte;
  }

  /**
   * Banner "Clase de hoy", debajo de las tarjetas de datos clave.
   * Si hoy no hay clase, el banner se oculta.
   */
  function renderBannerHoy() {
    var banner = document.getElementById("today-banner");
    if (!banner) return;

    var lista = typeof clases !== "undefined" && Array.isArray(clases) ? clases.slice() : [];
    var ahora = new Date();

    /* Mismo orden que la tabla, para saber si la clase de hoy es de las
       abiertas o ya hace parte del diplomado completo. */
    lista.sort(function (a, b) {
      return new Date(a.fecha) - new Date(b.fecha);
    });

    /* Buscamos la clase de hoy (la primera, si hubiera varias) */
    var claseHoy = null;
    var hoyBloqueada = false;
    for (var i = 0; i < lista.length; i++) {
      var f = new Date(lista[i].fecha);
      if (isNaN(f.getTime())) continue;
      if (estadoDeClase(lista[i], f, ahora) === "hoy") {
        claseHoy = lista[i];
        hoyBloqueada = i >= cuantasGratis();
        break;
      }
    }

    if (!claseHoy) {
      banner.hidden = true;
      banner.innerHTML = "";
      return;
    }

    var acceso = calcularAcceso(claseHoy, "hoy", hoyBloqueada);
    var fecha = new Date(claseHoy.fecha);

    banner.className = "today" + (acceso.activo ? "" : " today--sin-link");
    banner.innerHTML = "";

    /* --- Info --- */
    var info = document.createElement("div");
    info.className = "today__info";

    var pulso = document.createElement("span");
    pulso.className = "today__pulse";
    pulso.setAttribute("aria-hidden", "true");

    var textos = document.createElement("div");

    var kicker = document.createElement("p");
    kicker.className = "today__kicker";
    kicker.textContent = "Clase de hoy";

    var tema = document.createElement("p");
    tema.className = "today__tema";
    tema.textContent = claseHoy.tema;

    var meta = document.createElement("p");
    meta.className = "today__meta";
    meta.innerHTML = escapar(claseHoy.docente) + ' · <span class="today__hora">' +
      escapar(formatearFechaHora(fecha)) + "</span>";

    textos.appendChild(kicker);
    textos.appendChild(tema);
    textos.appendChild(meta);
    info.appendChild(pulso);
    info.appendChild(textos);

    /* --- Botón --- */
    var boton;
    if (acceso.activo) {
      boton = document.createElement("a");
      boton.className = "today__cta";
      boton.href = acceso.url;
      boton.target = "_blank";
      boton.rel = "noopener";
      boton.setAttribute("aria-label", "Entrar a la clase de hoy: " + claseHoy.tema);
    } else {
      boton = document.createElement("span");
      boton.className = "today__cta today__cta--disabled";
    }
    boton.appendChild(document.createTextNode(acceso.texto));

    banner.appendChild(info);
    banner.appendChild(boton);
    banner.hidden = false;
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

  /**
   * Deja todos los botones de WhatsApp del HTML apuntando al número de
   * clases-data.js, cada uno con su mensaje ya escrito (atributo data-wa).
   * Así el número solo se cambia en un lugar.
   */
  function aplicarEnlacesWhatsApp() {
    var enlaces = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < enlaces.length; i++) {
      enlaces[i].href = enlaceWhatsApp(enlaces[i].getAttribute("data-wa"));
    }
  }

  /** Rellena en el texto cuántas clases son abiertas y cuántas bloqueadas. */
  function renderConteoClases() {
    var total = typeof clases !== "undefined" && Array.isArray(clases) ? clases.length : 0;
    var gratis = Math.min(cuantasGratis(), total);
    var bloqueadas = Math.max(0, total - gratis);

    var abiertas = document.querySelectorAll("[data-clases-gratis]");
    for (var i = 0; i < abiertas.length; i++) {
      abiertas[i].textContent = String(gratis);
    }

    var cerradas = document.querySelectorAll("[data-clases-bloqueadas]");
    for (var j = 0; j < cerradas.length; j++) {
      cerradas[j].textContent = String(bloqueadas);
    }
  }

  /* Elementos de promo que actualiza el contador cada segundo */
  var promoElementos = [];
  var promoFechaLimite = null;
  var promoIntervalo = null;

  /**
   * Promoción: rellena los textos desde clases-data.js, activa el contador
   * regresivo y muestra tanto el banner del final como la barra fija de
   * arriba. Todo se oculta solo si PROMO_ACTIVA es false o si ya venció.
   */
  function renderPromo() {
    var banner = document.getElementById("promo-banner");
    var barra = document.getElementById("promobar");
    promoElementos = [];
    if (banner) promoElementos.push(banner);
    if (barra) promoElementos.push(barra);
    if (promoElementos.length === 0) return;

    var activa = typeof PROMO_ACTIVA === "undefined" ? false : PROMO_ACTIVA === true;
    if (!activa) {
      ocultarPromo();
      return;
    }

    /* Textos (cada pieza solo si está definida en clases-data.js) */
    var campos = {
      "[data-promo-etiqueta]": typeof PROMO_ETIQUETA !== "undefined" ? PROMO_ETIQUETA : null,
      "[data-promo-monto]": typeof PROMO_MONTO !== "undefined" ? PROMO_MONTO : null,
      "[data-promo-texto]": typeof PROMO_TEXTO !== "undefined" ? PROMO_TEXTO : null,
      "[data-promo-cierre]": typeof PROMO_CIERRE !== "undefined" ? PROMO_CIERRE : null
    };
    promoElementos.forEach(function (raiz) {
      for (var sel in campos) {
        if (!campos.hasOwnProperty(sel) || campos[sel] == null) continue;
        var nodos = raiz.querySelectorAll(sel);
        for (var i = 0; i < nodos.length; i++) nodos[i].textContent = campos[sel];
      }
    });

    /* Enlace de WhatsApp con el mensaje propio de la promo */
    var href = enlaceWhatsAppMensaje(
      typeof PROMO_MENSAJE_WA !== "undefined" ? PROMO_MENSAJE_WA : null);
    promoElementos.forEach(function (raiz) { raiz.href = href; });

    /* Fecha límite → contador */
    promoFechaLimite = null;
    if (typeof PROMO_FECHA_LIMITE !== "undefined" && String(PROMO_FECHA_LIMITE).trim() !== "") {
      var f = new Date(PROMO_FECHA_LIMITE);
      if (!isNaN(f.getTime())) promoFechaLimite = f;
    }

    /* Ya venció: no mostramos nada */
    if (promoFechaLimite && promoFechaLimite.getTime() <= Date.now()) {
      ocultarPromo();
      return;
    }

    promoElementos.forEach(function (raiz) { raiz.hidden = false; });
    document.body.classList.add("con-promobar");

    if (promoFechaLimite) {
      actualizarCuentaRegresiva();
      if (promoIntervalo) clearInterval(promoIntervalo);
      promoIntervalo = setInterval(actualizarCuentaRegresiva, 1000);
    }
  }

  function ocultarPromo() {
    promoElementos.forEach(function (raiz) { raiz.hidden = true; });
    document.body.classList.remove("con-promobar");
    if (promoIntervalo) { clearInterval(promoIntervalo); promoIntervalo = null; }
  }

  /** Escribe "2d 05h 12m 30s" en cada contador y oculta la promo al llegar a 0. */
  function actualizarCuentaRegresiva() {
    if (!promoFechaLimite) return;
    var restante = promoFechaLimite.getTime() - Date.now();

    if (restante <= 0) {
      ocultarPromo();
      return;
    }

    var seg = Math.floor(restante / 1000);
    var dias = Math.floor(seg / 86400);
    var horas = Math.floor((seg % 86400) / 3600);
    var mins = Math.floor((seg % 3600) / 60);
    var segs = seg % 60;

    function dos(n) { return (n < 10 ? "0" : "") + n; }
    var texto = (dias > 0 ? dias + "d " : "") +
      dos(horas) + "h " + dos(mins) + "m " + dos(segs) + "s";

    promoElementos.forEach(function (raiz) {
      var caja = raiz.querySelector("[data-promo-countdown]");
      var valor = raiz.querySelector("[data-promo-countdown-valor]");
      if (valor) valor.textContent = texto;
      if (caja) caja.hidden = false;
    });
  }

  /* ---------------------------------------------------------------------
     Header que aparece al hacer scroll + barra de progreso
     --------------------------------------------------------------------- */
  function activarTopbar() {
    var topbar = document.getElementById("topbar");
    var progreso = document.getElementById("topbar-progress");
    var hero = document.querySelector(".hero");
    if (!topbar) return;

    var pendiente = false;

    function actualizar() {
      pendiente = false;

      var y = window.pageYOffset || document.documentElement.scrollTop;

      /* El header entra cuando ya casi no se ve el hero */
      var umbral = hero ? hero.offsetHeight - 90 : 240;
      topbar.classList.toggle("topbar--visible", y > umbral);

      /* Progreso de lectura */
      if (progreso) {
        var alto = document.documentElement.scrollHeight - window.innerHeight;
        var pct = alto > 0 ? (y / alto) * 100 : 0;
        progreso.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + "%";
      }
    }

    function alHacerScroll() {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    }

    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("resize", alHacerScroll, { passive: true });
    actualizar();
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  function iniciar() {
    renderFechaInicio();
    aplicarEnlacesWhatsApp();
    renderConteoClases();
    renderPromo();
    renderHorario();
    renderBannerHoy();
    activarTopbar();

    /* Revisamos cada minuto para que el estado cambie solo al pasar la
       medianoche en Colombia, sin necesidad de recargar la página. */
    function refrescar() {
      renderHorario();
      renderBannerHoy();
    }

    setInterval(refrescar, 60000);

    /* También al volver a la pestaña tras un rato */
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refrescar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
