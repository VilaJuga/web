(function () {
  const LEGACY_KEY = "vilajuga_page_edits_v1";
  const NEW_KEY = "vilajuga_visual_editor_v3";

  function getPageKey() {
    const pathname = window.location.pathname.replace(/\\/g, "/");
    if (pathname.includes("/pages/")) return pathname.substring(pathname.indexOf("/pages/") + 1);
    if (pathname.endsWith("/index.html") || pathname === "/" || pathname === "") return "index.html";
    const clean = pathname.replace(/^\//, "");
    if (clean.endsWith(".html")) return clean;
    return "index.html";
  }

  function applyLegacy(pageKey) {
    let legacy;
    try {
      legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "{}");
    } catch (_error) {
      return;
    }

    const edits = legacy?.pages?.[pageKey];
    if (!edits) return;

    Object.entries(edits).forEach(([path, edit]) => {
      const el = document.querySelector(path);
      if (!el) return;

      if (edit.type === "text") {
        if (typeof edit.text === "string") el.textContent = edit.text;
        if (el.tagName === "A" && typeof edit.href === "string") el.setAttribute("href", edit.href);
      }

      if (edit.type === "image") {
        if (typeof edit.src === "string") el.setAttribute("src", edit.src);
        if (typeof edit.alt === "string") el.setAttribute("alt", edit.alt);
      }

      if (edit.type === "background-image" && typeof edit.url === "string") {
        el.style.backgroundImage = `url('${edit.url}')`;
      }
    });
  }

  function renderCustomBlock(block) {
    const wrap = document.createElement("section");
    wrap.className = "vj-custom-block";
    const data = block.data || {};

    if (block.type === "texto") wrap.innerHTML = `<p>${data.content || ""}</p>`;
    if (block.type === "imagen") wrap.innerHTML = `<img src="${data.image || ""}" alt="${data.alt || ""}" />`;
    if (block.type === "lista") {
      const items = String(data.items || "").split("\n").filter(Boolean).map((item) => `<li>${item}</li>`).join("");
      wrap.innerHTML = `<h3>${data.title || ""}</h3><ul>${items}</ul>`;
    }
    if (block.type === "linea") wrap.innerHTML = "<hr>";
    if (block.type === "enlace") wrap.innerHTML = `<a href="${data.url || "#"}">${data.label || "Boton"}</a>`;
    if (block.type === "video") wrap.innerHTML = `<iframe src="${data.url || ""}" width="100%" height="320" style="border:0;"></iframe>`;
    if (block.type === "noticia") wrap.innerHTML = `<img src="${data.image || ""}"><h2>${data.title || ""}</h2><p>${data.date || ""}</p><div>${data.content || ""}</div><p><a href="${data.link || "#"}">Leer mas</a></p>`;
    if (block.type === "evento") wrap.innerHTML = `<h2>${data.title || ""}</h2><p>${data.startDate || ""} ${data.time || ""}</p><p>${data.location || ""}</p><div>${data.description || ""}</div>`;
    if (block.type === "miembro") wrap.innerHTML = `<div><img src="${data.image || ""}" alt="${data.name || ""}"><h3>${data.name || ""}</h3><p>${data.role || ""}</p><p>${data.email || ""}</p><p>${data.phone || ""}</p></div>`;
    if (block.type === "galeria") {
      const images = Array.isArray(data.images) ? data.images : [];
      wrap.innerHTML = `<h3>${data.title || "Galeria"}</h3><div>${images.map((src) => `<img src="${src}" alt="">`).join("")}</div>`;
    }

    return wrap;
  }

  function applyV3(pageKey) {
    let store;
    try {
      store = JSON.parse(localStorage.getItem(NEW_KEY) || "{}");
    } catch (_error) {
      return;
    }

    const page = store?.pages?.[pageKey];
    if (!page) return;

    Object.entries(page.nodes || {}).forEach(([selector, edit]) => {
      const el = document.querySelector(selector);
      if (!el) return;

      if (typeof edit.html === "string") el.innerHTML = edit.html;
      if (typeof edit.src === "string") el.setAttribute("src", edit.src);
      if (typeof edit.alt === "string") el.setAttribute("alt", edit.alt);
      if (typeof edit.href === "string" && el.tagName === "A") el.setAttribute("href", edit.href);
      if (typeof edit.align === "string") el.style.textAlign = edit.align;
      if (typeof edit.className === "string") el.className = edit.className;
      if (typeof edit.id === "string") el.id = edit.id;
      if (typeof edit.backgroundImage === "string" && edit.backgroundImage) el.style.backgroundImage = `url('${edit.backgroundImage}')`;
      if (edit.hidden) el.style.display = "none";
    });

    (page.customBlocks || []).forEach((block) => {
      if (block.visible === false) return;
      const element = renderCustomBlock(block);
      const anchor = document.querySelector(block.anchor || "main");
      if (anchor && anchor.parentElement) anchor.insertAdjacentElement("afterend", element);
      else document.body.appendChild(element);
    });
  }

  function applyEdits() {
    const pageKey = getPageKey();
    applyLegacy(pageKey);
    applyV3(pageKey);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyEdits);
  } else {
    applyEdits();
  }
})();
