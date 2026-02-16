# INDEX.md

## Regla de trabajo solicitada por el usuario
Cada vez que me des una orden y eso implique cambios de código, actualizaré este archivo con:
- Fecha y hora.
- Qué me pediste.
- Qué archivos/carpetas modifiqué.
- Cómo funciona lo nuevo.
- Commit y push realizados.
- Política activa adicional: subir siempre TODO lo que exista en el workspace (incluyendo archivos nuevos/no trackeados) cuando pidas subir cambios.

## Historial de cambios

### 2026-02-16
- Solicitud: separar el código en más carpetas/archivos, crear `INDEX.md` y subir siempre los cambios a GitHub.
- Estructura creada:
  - `index.html`
  - `src/data/content.js`
  - `src/scripts/main.js`
  - `src/scripts/modules/menu.js`
  - `src/scripts/modules/slider.js`
  - `src/scripts/modules/backtop.js`
  - `src/scripts/modules/reveal.js`
  - `src/scripts/modules/render.js`
  - `src/styles/main.css`
  - `src/styles/variables.css`
  - `src/styles/base.css`
  - `src/styles/layout.css`
  - `src/styles/responsive.css`
  - `src/styles/components/nav.css`
  - `src/styles/components/hero.css`
  - `src/styles/components/intro.css`
  - `src/styles/components/cards.css`
  - `src/styles/components/timeline.css`
  - `src/styles/components/visit.css`
  - `src/styles/components/backtop.css`
- Funcionamiento:
  - `src/data/content.js` centraliza todo el contenido (menú, slides, textos, tarjetas, timeline y bloque de visita).
  - `src/scripts/modules/render.js` pinta HTML dinámico usando esos datos.
  - `src/scripts/modules/menu.js` controla apertura/cierre del menú móvil.
  - `src/scripts/modules/slider.js` controla slider, flechas, dots y autoplay.
  - `src/scripts/modules/reveal.js` aplica animación de aparición al timeline al hacer scroll.
  - `src/scripts/modules/backtop.js` gestiona el botón de volver arriba.
  - `src/styles/main.css` importa los estilos por módulos para mantener separación.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (ajuste de fidelidad visual)
- Solicitud: no añadir cosas que no estaban en la web original; mantenerla igual en código (sin WordPress), conservando “Veniu a gaudir”.
- Cambios aplicados:
  - `index.html`: eliminado el bloque de marca extra en cabecera (`VilaJuga`) para no introducir elementos nuevos.
  - `src/scripts/modules/render.js`: enlaces del menú sin `target="_blank"` para comportamiento más fiel.
  - `src/styles/components/nav.css`: cabecera centrada y menú móvil ajustado sin depender de marca añadida.
- Funcionamiento:
  - La web mantiene la misma estructura y secciones ya clonadas, pero quitando añadidos no presentes originalmente.
  - Se conserva el bloque “Veniu a gaudir!” tal como pediste.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (timeline “Què s'hi inclou?” igualado al original)
- Solicitud: dejar la sección “Què s'hi inclou?” 100% igual al original.
- Cambios aplicados:
  - `index.html`: añadido CSS de Font Awesome 5 para iconos idénticos de la línea temporal.
  - `src/data/content.js`: el dataset del timeline ahora usa campos equivalentes al original (`label`, `subLabel`, `iconClass`, `title`, `description`).
  - `src/scripts/modules/render.js`: render del timeline reescrito con estructura tipo WordPress/Elementor (`wpr-timeline-entry`, `wpr-extra-label`, `wpr-main-line-icon`, etc.).
  - `src/styles/components/timeline.css`: estilos del timeline rehaciendo línea central, alternancia izquierda/derecha, etiquetas e iconos.
  - `src/styles/responsive.css`: ajustes responsive específicos del nuevo timeline.
- Funcionamiento:
  - La sección “Què s'hi inclou?” ahora replica la jerarquía visual del original: etiqueta + subetiqueta, icono centrado en la línea y tarjeta de contenido alternada.
  - Se mantienen los textos originales y la animación de aparición al scroll.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (ajuste final para clon exacto del timeline)
- Solicitud: “hazlo IGUAL”.
- Cambios aplicados:
  - `index.html`: se cargan las mismas hojas de estilo base de Elementor y Royal Addons usadas por la web original para que el timeline use el mismo motor visual.
  - `src/scripts/modules/render.js`: estructura del timeline adaptada al wrapper exacto (`wpr-wrapper wpr-vertical wpr-centered` + `wpr-timeline-centered ...`).
  - `src/styles/components/timeline.css`: se eliminan overrides locales del timeline para no distorsionar el estilo original del widget.
  - `src/styles/responsive.css`: se eliminan reglas responsive custom del timeline.
  - `src/scripts/main.js`: se quita animación custom añadida al timeline.
- Funcionamiento:
  - El bloque “Què s'hi inclou?” queda renderizado con el marcado y estilos del mismo sistema de la web original, evitando aproximaciones propias.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (timeline igual sin romper el resto)
- Solicitud: dejar “Què s'hi inclou?” igual al original, manteniendo el resto como está ahora.
- Cambios aplicados:
  - `index.html`: se añade la hoja `post-12.css` original de Elementor y se aplica a esta sección la misma estructura/clases (`elementor-element-966b2c5`, `elementor-element-946e0f6`, `elementor-element-0c5f9fc`).
  - `index.html`: `body` pasa a `class="elementor-12"` para activar selectores de esa hoja solo cuando existen los IDs/clases de widget.
  - `src/styles/components/timeline.css`: se elimina override visual propio y se deja solo posicionamiento base para no interferir.
- Funcionamiento:
  - El timeline usa las reglas originales de diseño del bloque en producción (márgenes, línea central, posición de labels/iconos y tipografías), mientras el resto conserva tu estructura actual.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (subir todo siempre)
- Solicitud: “súbelo TODO, SIEMPRE”.
- Cambios aplicados:
  - Se versionan explícitamente también archivos no trackeados (`post-12.css`, `site_source.html`).
  - Se añade la política de subida total en este `INDEX.md`.
- Funcionamiento:
  - A partir de esta instrucción, cuando pidas subir cambios se incluye todo el contenido actual del workspace.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (admin visual completo)
- Solicitud: añadir un admin visual/gráfico para modificar toda la interfaz normal de la web, con credenciales `Marc` / `1701`.
- Cambios aplicados:
  - `admin.html`: nuevo panel de administración con login y dashboard visual.
  - `src/styles/admin.css`: estilo completo del admin (layout visual, paneles, repetidores, previews y feedback).
  - `src/scripts/admin.js`: lógica de autenticación, edición por bloques, guardado/restauración y acciones de panel.
  - `src/scripts/modules/data-store.js`: capa de persistencia en `localStorage` (`get/save/reset`) para datos del sitio.
  - `src/data/content.js`: refactor a `defaultSiteData` + clonado seguro.
  - `src/scripts/main.js`: la web principal ahora se renderiza desde datos persistidos, no solo hardcode.
- Funcionamiento:
  - Entra en `admin.html` con usuario `Marc` y contraseña `1701`.
  - Edita menú, slider, intro, galería, cards, timeline y sección final.
  - Guarda cambios y se aplican en `index.html` vía `localStorage`.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (admins múltiples + superadmin + editor simplificado)
- Solicitud: simplificar el admin para que sea más fácil de editar y menos técnico; añadir admins extra y superadmin con control para inhabilitar admins.
- Cambios aplicados:
  - `src/scripts/admin.js`:
    - Nuevo sistema de cuentas:
      - Admins: `Marc/1701`, `Aleix/1234`, `Miriam/1234`, `Joan/1234`, `Miki/1234`, `Genís/1234`, `Sergi/1234`.
      - Superadmin: `DaVinci/HVitruviano`.
    - Login con roles (`admin`/`superadmin`) y bloqueo por estado de habilitación.
    - Submenu de superadmin para habilitar/inhabilitar admins (persistente en `localStorage`).
    - Formularios del editor con textos más simples y menos técnicos.
    - Timeline con selector de icono amigable (sin editar clases CSS manuales).
  - `admin.html`:
    - Badge de rol visible.
    - Panel exclusivo de superadmin para gestión de usuarios.
  - `src/styles/admin.css`:
    - Estilos para badge de rol, ayuda contextual y lista visual de admins.
- Funcionamiento:
  - Los admins normales editan contenido.
  - El superadmin edita contenido y además puede inhabilitar/habilitar cuentas admin desde el propio panel.
- Git: commit y push realizados al finalizar este turno.
