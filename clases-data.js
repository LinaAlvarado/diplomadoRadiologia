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
    tema: "Anatomía radiológica de cráneo",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: "https://ejemplo.com/clase-1",
    grabacion: "https://ejemplo.com/grabacion-1"
  },
  {
    tema: "Anatomía radiológica de tórax",
    docente: "Diego Alberto Pérez",
    fecha: "2026-07-13T18:00:00-05:00",
    link: "https://ejemplo.com/clase-2",
    grabacion: ""
  },
  {
    /* 👇 Esta es la clase de EJEMPLO marcada como "HOY" (ver MODO_DEMO abajo) */
    tema: "Anatomía radiológica de abdomen",
    docente: "Mateo Correa",
    fecha: "2026-07-20T18:00:00-05:00",
    link: "https://ejemplo.com/clase-3",
    demoHoy: true
  },
  {
    /* 👇 Ejemplo de clase con AVISO DE CAMBIO */
    tema: "TEC (Trauma encefalocraneano)",
    docente: "Diego Alberto Pérez",
    fecha: "",
    link: "https://ejemplo.com/clase-4",
    cambio: "Cambio de fecha",
    cambioFecha: "2026-07-20"
  },
  {
    tema: "Radiografía de tórax",
    docente: "Diego Alberto Pérez",
    fecha: "",
    link: ""
  },
  {
    tema: "Indicación de contraste en tomografía",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  },
  {
    tema: "Síndrome aórtico",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: ""
  },
  {
    tema: "TEP (Tromboembolismo pulmonar)",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  },
  {
    tema: "Neumonía",
    docente: "Diego Alberto Pérez",
    fecha: "",
    link: ""
  },
  {
    tema: "Abdomen agudo por tomografía",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: ""
  },
  {
    tema: "Isquemia mesentérica",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: ""
  },
  {
    tema: "Urolitiasis",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: ""
  },
  {
    tema: "Miembro superior (anatomía, fracturas y luxaciones)",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  },
  {
    tema: "Miembro inferior (anatomía, fracturas y luxaciones)",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  },
  {
    tema: "Trauma de tórax",
    docente: "Diego Alberto Pérez",
    fecha: "",
    link: ""
  },
  {
    tema: "Trauma de abdomen",
    docente: "Sebastián García Patiño",
    fecha: "",
    link: ""
  },
  {
    tema: "Obstrucción intestinal",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  },
  {
    tema: "Trauma no accidental",
    docente: "Mateo Correa",
    fecha: "",
    link: ""
  }
];

/* -------------------------------------------------------------------------
   FECHA DE INICIO DEL DIPLOMADO (tarjeta "Fecha de inicio")
   Texto libre, por ejemplo: "1 de agosto de 2026"
   ------------------------------------------------------------------------- */
const fechaInicioDiplomado = "1 de agosto de 2026";

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
