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

### 2026-02-16 (logout + diseño tipo Google Sites)
- Solicitud: añadir “cerrar sesión” y hacer la interfaz de edición muy parecida al estilo Google Sites, hiper simple.
- Cambios aplicados:
  - `admin.html`:
    - botón nuevo `Tancar sessió`.
  - `src/scripts/admin.js`:
    - lógica de cierre de sesión (volver al login y limpiar campos/estado visual).
    - login también con tecla Enter en contraseña.
  - `src/styles/admin.css`:
    - rediseño completo a estética clara y minimalista (fondos blancos, bordes suaves, azul principal, jerarquía simple).
    - simplificación visual de botones, paneles, formularios y listados.
- Funcionamiento:
  - El editor ahora es más limpio y directo para edición diaria.
  - Puedes cerrar sesión desde el panel sin recargar página.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (editor ultra simple estilo Google Sites)
- Solicitud: edición 100% estilo Google Sites, hiper simple para que un niño pueda editar.
- Cambios aplicados:
  - `admin.html`:
    - estructura nueva tipo Sites: barra superior + sidebar de secciones + panel único de edición.
    - login simple y botón visible de cerrar sesión.
  - `src/styles/admin.css`:
    - rediseño completo a estilo limpio Google (fondo gris claro, tarjetas blancas, azul primario, tipografía simple).
    - controles grandes, claros y sin ruido visual.
  - `src/scripts/admin.js`:
    - navegación por secciones (`Menu`, `Portada`, `Introducció`, `Galeria`, `Blocs`, `Timeline`, `Final`).
    - formularios guiados sin acciones complejas (sin eliminar/añadir elementos libres).
    - edición fija por bloques para evitar errores y hacerlo apto para usuarios no técnicos.
    - superadmin mantiene sección `Admins` para activar/desactivar cuentas.
    - cierre de sesión real y flujo de login simplificado.
- Funcionamiento:
  - La edición ahora es más parecida a Google Sites: elegir sección a la izquierda y editar campos simples a la derecha.
  - Se mantiene guardado/restauración y persistencia de cambios en `localStorage`.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (edición sobre la página tipo Google Sites)
- Solicitud: editar directamente “encima de la página”, ver exactamente lo que se verá después, todo en castellano y aún más simple.
- Cambios aplicados:
  - `admin.html`:
    - nuevo layout de editor visual con:
      - login en castellano,
      - barra superior de acciones,
      - iframe central con la web real (`index.html`) en edición,
      - panel lateral de propiedades del elemento seleccionado.
  - `src/styles/admin.css`:
    - nuevo diseño limpio tipo Google Sites (lienzo principal + inspector lateral).
  - `src/scripts/admin.js`:
    - modo WYSIWYG real: clic en texto/imagen de la web para editar ese mismo elemento.
    - selección visual de elementos editables.
    - edición en tiempo real y guardado a `localStorage` leyendo la página editada.
    - mantenimiento de roles admin/superadmin + gestión de admins para superadmin.
    - todo el flujo y mensajes en castellano.
- Funcionamiento:
  - El usuario edita directamente lo que ve en pantalla y ese resultado es el que se guarda.
  - Se conserva restaurar, guardar, abrir web y cerrar sesión.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-16 (editor visual para toda la web)
- Solicitud: ampliar para editar toda la web entera con experiencia de edición sobre la página, en castellano.
- Cambios aplicados:
  - `pages/`:
    - nuevas copias locales de páginas del menú:
      - `pages/actividades-2026.html`
      - `pages/ludoteca.html`
      - `pages/sobre-nosotros.html`
      - `pages/contacto.html`
      - `pages/como-llegar.html`
  - `admin.html`:
    - nuevo selector de página (`Inicio`, `Actividades 2026`, `Ludoteca`, etc.) para editar toda la web desde un único editor.
  - `src/scripts/admin.js`:
    - flujo WYSIWYG sobre iframe para múltiples páginas.
    - edición directa por clic en textos/imágenes/fondos y guardado de cambios por página.
    - mantenimiento de login admin/superadmin y gestión de usuarios admin.
  - `src/scripts/page-edits-loader.js` (nuevo):
    - script común que aplica automáticamente las ediciones guardadas a cada página en tiempo de carga.
  - `index.html` y páginas en `pages/`:
    - inyección del loader para que los cambios guardados se reflejen fuera del admin.
  - `src/data/content.js`:
    - enlaces del menú principal cambiados a rutas locales para navegar/editar el sitio completo clonado.
- Funcionamiento:
  - Puedes elegir cualquier página del sitio desde el selector superior del admin y editarla visualmente.
  - Lo que guardas se aplica en esa página concreta cuando se abre normalmente.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-20 (editor visual tipo Google Sites para toda la web)
- Solicitud: crear un editor visual muy simple e intuitivo (estilo Google Sites) para editar toda la web copiada de `vilajuga.org`, sin tocar código, con bloques, preview, autosave, atajos y gestión por páginas.
- Cambios aplicados:
  - `admin.html`:
    - rediseño completo del editor en split-screen:
      - toolbar superior (modo edición, guardar, preview, configuración, deshacer/rehacer, usuario),
      - sidebar con pestañas `AÑADIR BLOQUES`, `ESTRUCTURA`, `PÁGINAS`,
      - canvas central con `iframe` editable,
      - panel derecho de configuración del bloque,
      - toolbar flotante de texto,
      - modal gestor de imágenes,
      - modal de vista previa responsive,
      - modal de configuración de página.
  - `src/styles/admin.css`:
    - nuevo sistema visual completo del editor (colores, layout, botones, modales, sidebar/canvas/panel derecho, responsive tablet/móvil).
  - `src/scripts/admin.js`:
    - reimplementación completa de lógica del editor:
      - login de admins/superadmin,
      - edición visual sobre la propia página (WYSIWYG en iframe),
      - edición inline de texto con barra flotante,
      - biblioteca de bloques (básicos + específicos Vilajuga) e inserción visual,
      - estructura de bloques con selección/mostrar-ocultar,
      - pestaña páginas con cambio, borradores y duplicado,
      - panel de configuración contextual por elemento/bloque,
      - gestor de imágenes (subida + biblioteca en localStorage),
      - auto-guardado cada 30s,
      - guardado manual y versiones (últimas 10),
      - deshacer/rehacer,
      - copiar/pegar/duplicar/eliminar bloque,
      - atajos de teclado (`Ctrl/Cmd+S`, `Z`, `Shift+Z`, `C`, `V`, `D`, `K`, `Esc`, `Delete`).
  - `src/scripts/page-edits-loader.js`:
    - ampliado para aplicar tanto el formato antiguo (`vilajuga_page_edits_v1`) como el nuevo (`vilajuga_visual_editor_v3`) en páginas públicas.
- Funcionamiento:
  - El editor permite editar textos e imágenes directamente sobre la web que se ve en pantalla.
  - Se pueden añadir bloques de noticia, evento, miembro y galería, además de bloques básicos.
  - Los cambios se guardan automáticamente y se reflejan en las páginas fuera del admin mediante el loader.
  - El superadmin mantiene control para habilitar/deshabilitar administradores dentro de configuración.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-20 (reorganización en carpetas: principal/editor/compartido)
- Solicitud: mover todo lo de la web principal a una carpeta, todo lo del editor a otra y lo compartido por ambas a una tercera carpeta.
- Nueva estructura aplicada:
  - `main/` (web principal):
    - `main/index.html`
    - `main/pages/*`
    - `main/src/data/*`
    - `main/src/scripts/*`
    - `main/src/styles/*`
    - `main/post-12.css`
  - `editor/` (web editor):
    - `editor/admin.html`
    - `editor/src/scripts/admin.js`
    - `editor/src/styles/admin.css`
  - `shared/` (uso común de ambas webs):
    - `shared/scripts/page-edits-loader.js`
- Ajustes técnicos realizados:
  - rutas actualizadas en `main/index.html` y en todas las páginas de `main/pages/` para cargar `shared/scripts/page-edits-loader.js`.
  - rutas actualizadas en `editor/admin.html` para abrir `../main/index.html` en el canvas y en preview.
  - `editor/src/scripts/admin.js` actualizado para editar páginas en rutas `main/...`.
  - `shared/scripts/page-edits-loader.js` ajustado para resolver claves de página con la nueva estructura (`main/index.html`, `main/pages/...`).
- Funcionamiento:
  - La web principal y el editor quedan físicamente separados.
  - El código común de persistencia visual queda aislado en `shared/`.
  - El editor sigue aplicando cambios sobre toda la web principal sin romper compatibilidad.
- Git: commit y push realizados al finalizar este turno.

### 2026-02-20 (hotfix acceso a web principal y editor)
- Incidencia: tras la reorganización por carpetas no existían puntos de entrada en raíz, por eso no abrían ni la web ni el editor al usar rutas antiguas.
- Corrección aplicada:
  - `index.html` (raíz) creado como redirección automática a `main/index.html`.
  - `admin.html` (raíz) creado como redirección automática a `editor/admin.html`.
- Funcionamiento:
  - Accesos antiguos vuelven a funcionar inmediatamente.
  - Se mantiene la estructura en carpetas (`main/`, `editor/`, `shared/`) sin romper compatibilidad.
- Git: commit y push realizados al finalizar este turno.
