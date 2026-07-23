/* =========================================================================
   CLASES DEL DIPLOMADO  —  ARCHIVO EDITABLE SEMANA A SEMANA
   =========================================================================

   Este es el ÚNICO archivo que necesitas tocar para actualizar el horario.
   No modifiques index.html ni script.js.

   -------------------------------------------------------------------------
   CAMPOS DE CADA CLASE
   -------------------------------------------------------------------------

   OBLIGATORIOS
     tema     → Nombre del tema tal como se muestra en la tabla.
     docente  → Nombre del docente.
     fecha    → Fecha y hora de inicio, en hora de Colombia. Estructura:
                    "AAAA-MM-DDTHH:MM:SS-05:00"
                Ejemplos:
                    6:00 p. m. del 1 de agosto de 2026 → "2026-08-01T18:00:00-05:00"
                    7:30 p. m. del 15 de agosto de 2026 → "2026-08-15T19:30:00-05:00"
                ⚠️ Formato de 24 horas (18:00 = 6 p. m.).
                ⚠️ No borres el "-05:00" del final: es lo que fija la hora de
                   Colombia sin importar dónde esté quien visita la página.
     link     → URL para entrar a la clase en vivo (Zoom / Meet / etc.).
                Si aún no la tienes, déjala vacía: ""

   OPCIONALES (puedes omitirlos o dejarlos en "")
     grabacion → URL de la grabación. Aparece automáticamente como botón
                 "Ver grabación" cuando la clase ya pasó.
                 Si la clase pasó y no hay grabación, el botón dice
                 "Grabación pronto".

     cambio    → ⚡ AVISO DE MODIFICACIÓN. Úsalo cuando cambies algo de una
                 clase que ya estaba publicada, para que quien la haya visto
                 antes se dé cuenta. Escribe qué cambió, en texto corto:
                     cambio: "Antes era a las 5:00 p. m."
                     cambio: "Cambió de docente"
                     cambio: "Nueva fecha, antes era el 8 de agosto"
                 Muestra una etiqueta naranja "Actualizado" + tu mensaje.
                 Para quitar el aviso, borra el texto y déjalo así: cambio: ""

     cambioFecha → Fecha en que hiciste ese cambio, formato "AAAA-MM-DD".
                   Solo se usa para el texto pequeño "Actualizado el ...".

   -------------------------------------------------------------------------
   PARA AGREGAR UNA CLASE: copia un bloque completo (desde "{" hasta "},")
   y pégalo dentro de la lista, cambiando los datos.
   El orden no importa: la página las ordena sola por fecha.
   ========================================================================= */

const clases = [
  {
    tema: "Anatomía Cerebral CT",
    docente: "Sebastián García Patiño",
    fecha: "2026-07-23T17:00:00-05:00",
    link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NmIyNTRmYWItMjA2YS00MTU2LTk1NTctNWM1ZGVjOWI4NGQ0%40thread.v2/0?context=%7b%22Tid%22%3a%224f637f79-0a56-410b-9b1e-0a776875c2af%22%2c%22Oid%22%3a%22ad9bcd70-3a3a-4483-811b-c7176ef6fbb5%22%7d",
    finalizada: true,
    grabacion: ""
  },
  {
    tema: "Indicación de contraste en tomografía",
    docente: "Mateo Correa",
    fecha: "2026-07-27T17:00:00-05:00",
    link: ""
  },
    {
    tema: "Miembro superior (anatomía, fracturas y luxaciones)",
    docente: "Mateo Correa",
    fecha: "2026-07-28T17:00:00-05:00",
    link: ""
  },
     {
    tema: "ACV (Accidente cerebrovascular)",
    docente: "Diego Alberto Pérez",
    fecha: "2026-07-29T17:00:00-05:00",
    link: ""
  },
    {
    /* 👇 Esta es la clase de EJEMPLO marcada como "HOY" (ver MODO_DEMO abajo) */
    tema: "Anatomía radiológica de abdomen",
    docente: "Sebastián García Patiño",
    fecha: "2026-07-30T17:00:00-05:00",
    link: "https://ejemplo.com/clase-3",
    // demoHoy: true
  },
  {
    tema: "Trauma de abdomen",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Anatomía radiológica de tórax",
    docente: "",
    fecha: "",
    link: "https://ejemplo.com/clase-2",
    grabacion: ""
  },

  {
    /* 👇 Ejemplo de clase con AVISO DE CAMBIO */
    tema: "TEC (Trauma encefalocraneano)",
    docente: "",
    fecha: "",
    link: "https://ejemplo.com/clase-4",
    // cambio: "Cambio de fecha",
    // cambioFecha: "2026-07-20"
  },
  {
    tema: "Radiografía de tórax",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Síndrome aórtico",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "TEP (Tromboembolismo pulmonar)",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Neumonía",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Abdomen agudo por tomografía",
    docente:"",
    fecha: "",
    link: ""
  },
  {
    tema: "Isquemia mesentérica",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Urolitiasis",
    docente: "",
    fecha: "",
    link: ""
  },

  {
    tema: "Miembro inferior (anatomía, fracturas y luxaciones)",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Trauma de tórax",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Obstrucción intestinal",
    docente: "",
    fecha: "",
    link: ""
  },
  {
    tema: "Trauma no accidental",
    docente: "",
    fecha: "",
    link: ""
  }
];

/* -------------------------------------------------------------------------
   FECHA DE INICIO DEL DIPLOMADO (tarjeta "Fecha de inicio")
   Texto libre, por ejemplo: "1 de agosto de 2026"
   ------------------------------------------------------------------------- */
const fechaInicioDiplomado = "Jueves 23 Julio";

/* -------------------------------------------------------------------------
   ACCESO GRATIS Y VENTA DEL DIPLOMADO
   -------------------------------------------------------------------------
   CLASES_GRATIS → Cuántas clases quedan abiertas al público, contando desde
                   la primera del cronograma. Las demás aparecen bloqueadas
                   con el botón "Desbloquear diplomado", que abre WhatsApp.
                   Si algún día quieres abrir todo, pon un número grande
                   (por ejemplo 999).

   WHATSAPP_NUMERO → Número al que llegan los mensajes de compra.
                     Formato: indicativo + número, sin espacios ni "+".

   WHATSAPP_MENSAJE → Texto que aparece ya escrito cuando la persona abre
                      el chat. Facilita que escriba.
   ------------------------------------------------------------------------- */
const CLASES_GRATIS = 7;
const WHATSAPP_NUMERO = "573022262221";
const WHATSAPP_MENSAJE =
  "Hola, quiero información para acceder al diplomado completo de interpretación de imágenes";

/* -------------------------------------------------------------------------
   PROMOCIÓN / BONO
   -------------------------------------------------------------------------
   Banner destacado que anuncia una promoción por tiempo limitado.

   PROMO_ACTIVA → true muestra el banner; false lo oculta por completo
                  (sin borrar nada, para poder reactivarlo después).

   PROMO_ETIQUETA → Texto pequeño de arriba. Ej: "Promoción exclusiva".
   PROMO_MONTO    → El valor del bono, bien grande. Ej: "$100.000".
   PROMO_TEXTO    → Frase que explica el beneficio.
   PROMO_CIERRE   → Nota final pequeña (condiciones / urgencia).
   ------------------------------------------------------------------------- */
const PROMO_ACTIVA = true;
const PROMO_ETIQUETA = "Promoción exclusiva";
const PROMO_MONTO = "$100.000";
const PROMO_TEXTO = "de bono en tu inscripción al diplomado completo.";
const PROMO_CIERRE = "Paga en 2 cuotas";
const PROMO_MENSAJE_WA =
  "Hola, quiero aprovechar el bono de $100.000 para inscribirme al diplomado completo.";

/* PROMO_FECHA_LIMITE → Cuándo termina la promo. Formato igual al de las
                        clases: "AAAA-MM-DDTHH:MM:SS-05:00".
                        Se muestra un contador regresivo ("Termina en 2d 05h…")
                        y, al llegar a cero, la promo se oculta sola.
                        Déjala en "" si no quieres contador ni vencimiento.  */
const PROMO_FECHA_LIMITE = "2026-07-25T23:59:00-05:00";

/* -------------------------------------------------------------------------
   MODO DEMO  —  solo para revisar el diseño
   -------------------------------------------------------------------------
   Con true, la clase que tenga  demoHoy: true  se ve SIEMPRE resaltada como
   "HOY", sin importar la fecha real. Sirve para revisar cómo queda ese
   estilo cualquier día del año.

   ⚠️ Ponlo en false antes de publicar la página, para que el resaltado de
      "HOY" vuelva a calcularse con la fecha real.
   ------------------------------------------------------------------------- */
const MODO_DEMO = true;
