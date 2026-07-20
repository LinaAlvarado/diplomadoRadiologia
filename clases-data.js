/* =========================================================================
   CLASES DEL DIPLOMADO  —  ARCHIVO EDITABLE SEMANA A SEMANA
   =========================================================================

   Este es el ÚNICO archivo que necesitas tocar para actualizar el horario.
   No modifiques index.html ni script.js.

   Cada clase es un objeto con 4 campos:

     tema     → Nombre del tema tal como se muestra en la tabla.
     docente  → Nombre del docente.
     fecha    → Fecha y hora de inicio, formato ISO con zona horaria de
                Colombia (-05:00).  Estructura:
                    "AAAA-MM-DDTHH:MM:SS-05:00"
                Ejemplos:
                    6:00 p.m. del 1 de agosto de 2026 → "2026-08-01T18:00:00-05:00"
                    7:30 p.m. del 15 de agosto de 2026 → "2026-08-15T19:30:00-05:00"
                ⚠️ Usa formato de 24 horas (18:00 = 6 p.m.).
                ⚠️ No borres el "-05:00" del final: es lo que fija la hora
                   de Colombia sin importar dónde esté quien visita la página.
     link     → URL de acceso a la clase (Zoom / Meet / etc.).
                Si aún no tienes el link, déjalo como cadena vacía: ""

   El estado de cada clase (pasada / HOY / futura) se calcula solo.
   El orden de la lista no importa: la página las ordena por fecha.

   ------------------------------------------------------------------------
   PARA AGREGAR UNA CLASE: copia un bloque completo (desde "{" hasta "},")
   y pégalo dentro de la lista, cambiando los datos.
   ========================================================================= */

const clases = [
  {
    tema: "Anatomía radiológica de cráneo",
    docente: "Sebastián García Patiño",
    fecha: "2026-08-01T18:00:00-05:00",
    link: "https://ejemplo.com/clase-1"
  },
  {
    tema: "Anatomía radiológica de tórax",
    docente: "Mateo Correa",
    fecha: "2026-08-08T18:00:00-05:00",
    link: "https://ejemplo.com/clase-2"
  },
  {
    tema: "Anatomía radiológica de abdomen",
    docente: "Diego Alberto Pérez",
    fecha: "2026-08-15T18:00:00-05:00",
    link: "https://ejemplo.com/clase-3"
  },
  {
    tema: "TEC (Trauma encefalocraneano)",
    docente: "Sebastián García Patiño",
    fecha: "2026-08-22T18:00:00-05:00",
    link: ""
  },
  {
    tema: "ACV (Ataque cerebrovascular)",
    docente: "Mateo Correa",
    fecha: "2026-08-29T18:00:00-05:00",
    link: ""
  }
];

/* -------------------------------------------------------------------------
   FECHA DE INICIO DEL DIPLOMADO (aparece en la tarjeta "Fecha de inicio")
   Escríbela como texto libre, por ejemplo: "1 de agosto de 2026"
   ------------------------------------------------------------------------- */
const fechaInicioDiplomado = "1 de agosto de 2026";
