import { cloneDefaultSiteData } from "../data/content.js";
import { getSiteData, saveSiteData, resetSiteData } from "./modules/data-store.js";

const ADMIN_STATUS_KEY = "vilajuga_admin_status_v1";

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

const loginView = document.getElementById("loginView");
const editorView = document.getElementById("editorView");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

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
let adminStatus = getAdminStatus();
let selected = null;

loginBtn.addEventListener("click", onLogin);
loginPass.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onLogin();
});

openSiteBtn.addEventListener("click", () => window.open("./index.html", "_blank"));

resetBtn.addEventListener("click", () => {
  resetSiteData();
  loadFrame();
  showToast("Contenido restaurado.");
});

saveBtn.addEventListener("click", () => {
  const data = collectDataFromFrame();
  saveSiteData(data);
  showToast("Cambios guardados.");
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

  loadFrame();
}

function loadFrame() {
  siteFrame.src = "index.html";
  siteFrame.onload = () => {
    enableInlineEditor(siteFrame.contentDocument);
    selected = null;
    selectionFields.innerHTML = "";
    selectionHelp.textContent = "Haz clic en texto o imagen para editar.";
  };
}

function enableInlineEditor(doc) {
  if (!doc) return;

  const style = doc.createElement("style");
  style.textContent = `
    .vj-editable { outline: 2px dashed transparent; outline-offset: 2px; cursor: text; }
    .vj-editable:hover { outline-color: #1a73e8; }
    .vj-selected { outline: 2px solid #1a73e8 !important; background: rgba(26,115,232,0.06); }
    img.vj-editable-img { outline: 2px dashed transparent; outline-offset: 2px; cursor: pointer; }
    img.vj-editable-img:hover { outline-color: #1a73e8; }
  `;
  doc.head.appendChild(style);

  const textSelectors = [
    "#mainNav a",
    "#introTitle",
    "#introDescription",
    "#cardsGrid .card h3",
    "#cardsGrid .card p",
    "#timeline .wpr-label",
    "#timeline .wpr-sub-label",
    "#timeline .wpr-title",
    "#timeline .wpr-description p",
    "#visitTitle",
    "#visitAddress",
  ];

  textSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => {
      el.classList.add("vj-editable");
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(el, "text");
      });
      if (el.tagName === "A") {
        el.addEventListener("click", (e) => e.preventDefault());
      }
    });
  });

  const imageSelectors = [
    "#introGallery img",
    "#cardsGrid .card img",
  ];

  imageSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => {
      el.classList.add("vj-editable-img");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(el, "image");
      });
    });
  });

  doc.querySelectorAll("#hero .hero-slide").forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectElement(el, "background-image");
    });
  });

  const visit = doc.querySelector("#visit");
  if (visit) {
    visit.style.cursor = "pointer";
    visit.addEventListener("click", (e) => {
      if (e.target.closest("#visitTitle") || e.target.closest("#visitAddress")) return;
      e.preventDefault();
      e.stopPropagation();
      selectElement(visit, "background-image");
    });
  }

  doc.addEventListener("click", () => {
    clearSelection();
  });
}

function selectElement(el, type) {
  clearSelection();
  selected = { el, type };
  el.classList.add("vj-selected");
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
      }));
    }

    selectionFields.appendChild(fieldArea("Texto", selected.el.textContent.trim(), (v) => {
      selected.el.textContent = v;
    }));
    return;
  }

  if (selected.type === "image") {
    selectionHelp.textContent = "Imagen seleccionada.";
    selectionFields.appendChild(field("URL imagen", selected.el.getAttribute("src") || "", (v) => {
      selected.el.setAttribute("src", v);
    }));
    selectionFields.appendChild(field("Texto alternativo", selected.el.getAttribute("alt") || "", (v) => {
      selected.el.setAttribute("alt", v);
    }));

    const img = document.createElement("img");
    img.className = "thumb";
    img.src = selected.el.getAttribute("src") || "";
    selectionFields.appendChild(img);
    return;
  }

  if (selected.type === "background-image") {
    selectionHelp.textContent = "Imagen de fondo seleccionada.";
    const current = extractUrl(selected.el.style.backgroundImage || "");
    selectionFields.appendChild(field("URL imagen de fondo", current, (v) => {
      selected.el.style.backgroundImage = `url('${v}')`;
    }));
  }
}

function collectDataFromFrame() {
  const doc = siteFrame.contentDocument;
  const defaults = cloneDefaultSiteData();

  const data = cloneDefaultSiteData();

  const nav = [...doc.querySelectorAll("#mainNav a")].map((a, i) => ({
    label: a.textContent.trim(),
    href: a.getAttribute("href") || defaults.navLinks[i]?.href || "#",
    active: a.classList.contains("active"),
  }));
  if (nav.length) data.navLinks = nav;

  const slides = [...doc.querySelectorAll("#hero .hero-slide")].map((el, i) =>
    extractUrl(el.style.backgroundImage || "") || defaults.heroSlides[i] || ""
  );
  if (slides.length) data.heroSlides = slides;

  data.intro.title = (doc.querySelector("#introTitle")?.textContent || defaults.intro.title).trim();
  data.intro.description = (doc.querySelector("#introDescription")?.textContent || defaults.intro.description).trim();

  const introGallery = [...doc.querySelectorAll("#introGallery img")].map((img, i) => ({
    src: img.getAttribute("src") || defaults.introGallery[i]?.src || "",
    alt: img.getAttribute("alt") || defaults.introGallery[i]?.alt || "",
    tall: img.classList.contains("tall"),
  }));
  if (introGallery.length) data.introGallery = introGallery;

  const cards = [...doc.querySelectorAll("#cardsGrid .card")].map((card, i) => ({
    title: (card.querySelector("h3")?.textContent || defaults.cards[i]?.title || "").trim(),
    text: (card.querySelector("p")?.textContent || defaults.cards[i]?.text || "").trim(),
    image: card.querySelector("img")?.getAttribute("src") || defaults.cards[i]?.image || "",
    alt: card.querySelector("img")?.getAttribute("alt") || defaults.cards[i]?.alt || "",
  }));
  if (cards.length) data.cards = cards;

  const timeline = [...doc.querySelectorAll("#timeline .wpr-timeline-entry")].map((entry, i) => ({
    side: entry.classList.contains("wpr-left-aligned") ? "left" : "right",
    label: (entry.querySelector(".wpr-label")?.textContent || defaults.timelineItems[i]?.label || "").trim(),
    subLabel: (entry.querySelector(".wpr-sub-label")?.textContent || defaults.timelineItems[i]?.subLabel || "").trim(),
    iconClass: entry.querySelector(".wpr-main-line-icon i")?.className || defaults.timelineItems[i]?.iconClass || "fas fa-dice",
    title: (entry.querySelector(".wpr-title")?.textContent || defaults.timelineItems[i]?.title || "").trim(),
    description: (entry.querySelector(".wpr-description p")?.textContent || defaults.timelineItems[i]?.description || "").trim(),
  }));
  if (timeline.length) data.timelineItems = timeline;

  data.visit.title = (doc.querySelector("#visitTitle")?.textContent || defaults.visit.title).trim();
  data.visit.address = (doc.querySelector("#visitAddress")?.textContent || defaults.visit.address).trim();
  data.visit.backgroundImage =
    extractUrl(doc.querySelector("#visit")?.style.background || "") || defaults.visit.backgroundImage;

  return data;
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
