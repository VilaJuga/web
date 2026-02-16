import { getSiteData, saveSiteData } from "./modules/data-store.js";

const ADMIN_STATUS_KEY = "vilajuga_admin_status_v1";
const PAGE_EDITS_KEY = "vilajuga_page_edits_v1";

const ACCOUNTS = [
  { user: "Marc", pwd: "1701", role: "admin" },
  { user: "Aleix", pwd: "1234", role: "admin" },
  { user: "Miriam", pwd: "1234", role: "admin" },
  { user: "Joan", pwd: "1234", role: "admin" },
  { user: "Miki", pwd: "1234", role: "admin" },
  { user: "Genís", pwd: "1234", role: "admin" },
  { user: "Sergi", pwd: "1234", role: "admin" },
  { user: "DaVinci", pwd: "HVitruviano", role: "superadmin" },
];

const PAGES = [
  { key: "index.html", label: "Inicio", url: "index.html" },
  { key: "pages/actividades-2026.html", label: "Actividades 2026", url: "pages/actividades-2026.html" },
  { key: "pages/ludoteca.html", label: "Ludoteca", url: "pages/ludoteca.html" },
  { key: "pages/sobre-nosotros.html", label: "Sobre nosotros", url: "pages/sobre-nosotros.html" },
  { key: "pages/contacto.html", label: "Contacto", url: "pages/contacto.html" },
  { key: "pages/como-llegar.html", label: "Como llegar", url: "pages/como-llegar.html" },
];

const loginView = document.getElementById("loginView");
const editorView = document.getElementById("editorView");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const pagePicker = document.getElementById("pagePicker");
const siteFrame = document.getElementById("siteFrame");
const sessionLabel = document.getElementById("sessionLabel");
const roleBadge = document.getElementById("roleBadge");
const selectionHelp = document.getElementById("selectionHelp");
const selectionFields = document.getElementById("selectionFields");
const adminUserList = document.getElementById("adminUserList");
const superAdminCard = document.getElementById("superAdminCard");
const toast = document.getElementById("toast");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const openSiteBtn = document.getElementById("openSiteBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentAccount = null;
let currentPage = PAGES[0];
let adminStatus = getAdminStatus();
let editsStore = getEditsStore();
let selected = null;

loginBtn.addEventListener("click", onLogin);
loginPass.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onLogin();
});

pagePicker.addEventListener("change", () => {
  const next = PAGES.find((p) => p.key === pagePicker.value);
  if (!next) return;
  currentPage = next;
  loadFrame();
});

openSiteBtn.addEventListener("click", () => {
  window.open(currentPage.url, "_blank");
});

saveBtn.addEventListener("click", () => {
  saveEditsStore(editsStore);
  showToast("Cambios guardados.");
});

resetBtn.addEventListener("click", () => {
  if (!editsStore.pages[currentPage.key]) {
    showToast("Esta página ya está limpia.");
    return;
  }

  delete editsStore.pages[currentPage.key];
  saveEditsStore(editsStore);
  if (currentPage.key === "index.html") {
    saveSiteData(getSiteData());
  }
  loadFrame();
  showToast("Página restaurada.");
});

logoutBtn.addEventListener("click", () => {
  currentAccount = null;
  selected = null;
  editorView.classList.add("hidden");
  loginView.classList.remove("hidden");
  loginUser.value = "";
  loginPass.value = "";
  loginError.textContent = "";
  selectionFields.innerHTML = "";
  selectionHelp.textContent = "Selecciona un elemento en la página para editarlo.";
});

function onLogin() {
  const account = findAccount(loginUser.value, loginPass.value);
  if (!account) {
    loginError.textContent = "Usuario o contraseña incorrectos.";
    return;
  }

  if (account.role === "admin" && adminStatus[account.user] === false) {
    loginError.textContent = "Este usuario está desactivado.";
    return;
  }

  currentAccount = account;
  loginError.textContent = "";
  loginView.classList.add("hidden");
  editorView.classList.remove("hidden");

  sessionLabel.textContent = `Sesión: ${account.user}`;
  roleBadge.textContent = account.role === "superadmin" ? "Superadmin" : "Admin";

  superAdminCard.classList.toggle("hidden", account.role !== "superadmin");
  if (account.role === "superadmin") renderAdminList();

  renderPagePicker();
  loadFrame();
}

function renderPagePicker() {
  pagePicker.innerHTML = PAGES.map((p) => `<option value="${p.key}">${p.label}</option>`).join("");
  pagePicker.value = currentPage.key;
}

function loadFrame() {
  selected = null;
  selectionFields.innerHTML = "";
  selectionHelp.textContent = "Haz clic en texto o imagen para editar.";
  siteFrame.src = `${currentPage.url}?editor=${Date.now()}`;

  siteFrame.onload = () => {
    const doc = siteFrame.contentDocument;
    if (!doc) return;
    applyEditsToDoc(doc, currentPage.key);
    wireEditable(doc);
  };
}

function wireEditable(doc) {
  const style = doc.createElement("style");
  style.textContent = `
    .vj-editable { outline: 2px dashed transparent; outline-offset: 2px; cursor: text; }
    .vj-editable:hover { outline-color: #1a73e8; }
    .vj-selected { outline: 2px solid #1a73e8 !important; background: rgba(26,115,232,0.08); }
    img.vj-editable-img { outline: 2px dashed transparent; outline-offset: 2px; cursor: pointer; }
    img.vj-editable-img:hover { outline-color: #1a73e8; }
  `;
  doc.head.appendChild(style);

  const textNodes = doc.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,a,li,button,strong,em,small,label");
  textNodes.forEach((el) => {
    if (!el.textContent.trim()) return;
    if (el.closest("script,style,noscript")) return;

    el.classList.add("vj-editable");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectElement(el, "text");
    });
  });

  doc.querySelectorAll("img").forEach((img) => {
    img.classList.add("vj-editable-img");
    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectElement(img, "image");
    });
  });

  doc.querySelectorAll("section,div,header,main,footer").forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") return;

    el.addEventListener("click", (e) => {
      if (e.target !== el) return;
      e.preventDefault();
      e.stopPropagation();
      selectElement(el, "background-image");
    });
  });

  doc.addEventListener("click", () => {
    clearSelection();
    selectionFields.innerHTML = "";
    selectionHelp.textContent = "Haz clic en texto o imagen para editar.";
  });
}

function selectElement(el, type) {
  clearSelection();
  selected = { el, type, path: getElementPath(el) };
  selected.el.classList.add("vj-selected");
  renderInspector();
}

function clearSelection() {
  if (selected?.el) selected.el.classList.remove("vj-selected");
  selected = null;
}

function renderInspector() {
  selectionFields.innerHTML = "";
  if (!selected) return;

  if (selected.type === "text") {
    selectionHelp.textContent = "Texto seleccionado.";

    if (selected.el.tagName === "A") {
      selectionFields.appendChild(field("Enlace", selected.el.getAttribute("href") || "", (v) => {
        selected.el.setAttribute("href", v);
        upsertEdit({ type: "text", text: selected.el.textContent, href: v });
      }));
    }

    selectionFields.appendChild(fieldArea("Texto", selected.el.textContent.trim(), (v) => {
      selected.el.textContent = v;
      upsertEdit({ type: "text", text: v, href: selected.el.getAttribute("href") || "" });
    }));
    return;
  }

  if (selected.type === "image") {
    selectionHelp.textContent = "Imagen seleccionada.";

    selectionFields.appendChild(field("URL imagen", selected.el.getAttribute("src") || "", (v) => {
      selected.el.setAttribute("src", v);
      upsertEdit({ type: "image", src: v, alt: selected.el.getAttribute("alt") || "" });
      refreshThumb(v);
    }));

    selectionFields.appendChild(field("Texto alternativo", selected.el.getAttribute("alt") || "", (v) => {
      selected.el.setAttribute("alt", v);
      upsertEdit({ type: "image", src: selected.el.getAttribute("src") || "", alt: v });
    }));

    const img = document.createElement("img");
    img.className = "thumb";
    img.src = selected.el.getAttribute("src") || "";
    img.id = "selectionThumb";
    selectionFields.appendChild(img);
    return;
  }

  if (selected.type === "background-image") {
    selectionHelp.textContent = "Fondo seleccionado.";
    const current = extractUrl(selected.el.style.backgroundImage || getComputedStyle(selected.el).backgroundImage);
    selectionFields.appendChild(field("URL imagen de fondo", current, (v) => {
      selected.el.style.backgroundImage = `url('${v}')`;
      upsertEdit({ type: "background-image", url: v });
    }));
  }
}

function refreshThumb(url) {
  const img = document.getElementById("selectionThumb");
  if (img) img.src = url;
}

function upsertEdit(payload) {
  if (!selected) return;
  editsStore.pages[currentPage.key] ||= {};
  editsStore.pages[currentPage.key][selected.path] = payload;
}

function applyEditsToDoc(doc, pageKey) {
  const edits = editsStore.pages[pageKey];
  if (!edits) return;

  Object.entries(edits).forEach(([path, edit]) => {
    const el = doc.querySelector(path);
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

function getEditsStore() {
  try {
    const raw = localStorage.getItem(PAGE_EDITS_KEY);
    if (!raw) return { version: 1, pages: {} };
    const parsed = JSON.parse(raw);
    return { version: 1, pages: parsed.pages || {} };
  } catch (_err) {
    return { version: 1, pages: {} };
  }
}

function saveEditsStore(store) {
  localStorage.setItem(PAGE_EDITS_KEY, JSON.stringify(store));
}

function renderAdminList() {
  adminUserList.innerHTML = "";

  ACCOUNTS.filter((a) => a.role === "admin").forEach((admin) => {
    const row = document.createElement("div");
    row.className = "switch-row";
    const enabled = adminStatus[admin.user] !== false;

    row.innerHTML = `<strong>${admin.user}</strong><label><input type="checkbox" ${enabled ? "checked" : ""} /> ${enabled ? "Activo" : "Inactivo"}</label>`;
    row.querySelector("input").addEventListener("change", (e) => {
      adminStatus[admin.user] = e.target.checked;
      saveAdminStatus(adminStatus);
      renderAdminList();
    });

    adminUserList.appendChild(row);
  });
}

function field(label, value, onInput) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  wrap.innerHTML = `<label>${label}</label><input type="text" value="${escapeHtml(value || "")}" />`;
  wrap.querySelector("input").addEventListener("input", (e) => onInput(e.target.value));
  return wrap;
}

function fieldArea(label, value, onInput) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  wrap.innerHTML = `<label>${label}</label><textarea>${escapeHtml(value || "")}</textarea>`;
  wrap.querySelector("textarea").addEventListener("input", (e) => onInput(e.target.value));
  return wrap;
}

function getElementPath(el) {
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== "html") {
    const parent = node.parentElement;
    if (!parent) break;

    const index = [...parent.children].indexOf(node) + 1;
    parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${index})`);

    if (node.tagName.toLowerCase() === "body") break;
    node = parent;
  }

  return parts.join(" > ");
}

function findAccount(inputUser, inputPwd) {
  const normalized = normalizeUser(inputUser);
  return ACCOUNTS.find((acc) => normalizeUser(acc.user) === normalized && acc.pwd === inputPwd);
}

function normalizeUser(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getAdminStatus() {
  const defaults = {};
  ACCOUNTS.filter((a) => a.role === "admin").forEach((a) => (defaults[a.user] = true));

  try {
    const raw = localStorage.getItem(ADMIN_STATUS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (_err) {
    return defaults;
  }
}

function saveAdminStatus(status) {
  localStorage.setItem(ADMIN_STATUS_KEY, JSON.stringify(status));
}

function extractUrl(cssText) {
  const match = String(cssText).match(/url\((['"]?)(.*?)\1\)/i);
  return match ? match[2] : "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
