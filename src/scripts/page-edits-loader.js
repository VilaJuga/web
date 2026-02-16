(function () {
  const KEY = "vilajuga_page_edits_v1";

  function getPageKey() {
    const pathname = window.location.pathname.replace(/\\/g, "/");
    if (pathname.includes("/pages/")) {
      return pathname.substring(pathname.indexOf("/pages/") + 1);
    }

    if (pathname.endsWith("/index.html") || pathname === "/" || pathname === "") {
      return "index.html";
    }

    const clean = pathname.replace(/^\//, "");
    if (clean.endsWith(".html")) return clean.split("/").pop();
    return "index.html";
  }

  function applyEdits() {
    let store;
    try {
      store = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (_err) {
      return;
    }

    const pageKey = getPageKey();
    const edits = store?.pages?.[pageKey];
    if (!edits) return;

    Object.entries(edits).forEach(([path, edit]) => {
      const el = document.querySelector(path);
      if (!el) return;

      if (edit.type === "text") {
        if (typeof edit.text === "string") el.textContent = edit.text;
        if (el.tagName === "A" && typeof edit.href === "string") el.setAttribute("href", edit.href);
        return;
      }

      if (edit.type === "image") {
        if (typeof edit.src === "string") el.setAttribute("src", edit.src);
        if (typeof edit.alt === "string") el.setAttribute("alt", edit.alt);
        return;
      }

      if (edit.type === "background-image" && typeof edit.url === "string") {
        el.style.backgroundImage = `url('${edit.url}')`;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyEdits);
  } else {
    applyEdits();
  }
})();
