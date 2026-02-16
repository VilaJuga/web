# INDEX.md

## Regla de trabajo solicitada por el usuario
Cada vez que me des una orden y eso implique cambios de código, actualizaré este archivo con:
- Fecha y hora.
- Qué me pediste.
- Qué archivos/carpetas modifiqué.
- Cómo funciona lo nuevo.
- Commit y push realizados.

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
