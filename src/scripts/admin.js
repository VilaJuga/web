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

const ICON_OPTIONS = [
  { label: "Dado", value: "fas fa-dice" },
  { label: "Dado D6", value: "fas fa-dice-d6" },
  { label: "Dado D20", value: "fas fa-dice-d20" },
  { label: "Seis caras", value: "fas fa-dice-six" },
];

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const userInput = document.getElementById("user");
const pwdInput = document.getElementById("pwd");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const openSiteBtn = document.getElementById("openSiteBtn");
const logoutBtn = document.getElementById("logoutBtn");
const roleBadge = document.getElementById("roleBadge");
const welcomeText = document.getElementById("welcomeText");
const sidebarNav = document.getElementById("sidebarNav");
const sectionTitle = document.getElementById("sectionTitle");
const sectionHelp = document.getElementById("sectionHelp");
const formRoot = document.getElementById("formRoot");
const toast = document.getElementById("toast");

let state = normalizeState(getSiteData());
let currentAccount = null;
let currentSection = "menu";
let adminStatus = getAdminStatus();

loginBtn.addEventListener("click", onLogin);
pwdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onLogin();
});

saveBtn.addEventListener("click", () => {
  saveSiteData(state);
  showToast("Canvis guardats.");
});

resetBtn.addEventListener("click", () => {
  state = normalizeState(resetSiteData());
  renderCurrentSection();
  showToast("Contingut restaurat.");
});

openSiteBtn.addEventListener("click", () => {
  window.open("./index.html", "_blank");
});

logoutBtn.addEventListener("click", () => {
  currentAccount = null;
  dashboard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  userInput.value = "";
  pwdInput.value = "";
  loginError.textContent = "";
});

function onLogin() {
  const account = findAccount(userInput.value, pwdInput.value);

  if (!account) {
    loginError.textContent = "Usuari o contrasenya incorrectes.";
    return;
  }

  if (account.role === "admin" && adminStatus[account.user] === false) {
    loginError.textContent = "Aquest usuari està inhabilitat.";
    return;
  }

  currentAccount = account;
  loginError.textContent = "";
  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  roleBadge.textContent = account.role === "superadmin" ? "Superadmin" : "Admin";
  welcomeText.textContent = `Hola, ${account.user}`;

  buildSidebar();
  currentSection = "menu";
  renderCurrentSection();
}

function buildSidebar() {
  const sections = [
    { id: "menu", label: "Menu" },
    { id: "hero", label: "Portada" },
    { id: "intro", label: "Introducció" },
    { id: "gallery", label: "Galeria" },
    { id: "cards", label: "Blocs" },
    { id: "timeline", label: "Timeline" },
    { id: "visit", label: "Final" },
  ];

  if (currentAccount?.role === "superadmin") {
    sections.push({ id: "admins", label: "Admins" });
  }

  sidebarNav.innerHTML = "";
  sections.forEach((sec) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-btn";
    btn.dataset.section = sec.id;
    btn.textContent = sec.label;
    btn.addEventListener("click", () => {
      currentSection = sec.id;
      renderCurrentSection();
    });
    sidebarNav.appendChild(btn);
  });
}

function renderCurrentSection() {
  [...sidebarNav.querySelectorAll(".nav-btn")].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === currentSection);
  });

  if (currentSection === "menu") return renderMenuSection();
  if (currentSection === "hero") return renderHeroSection();
  if (currentSection === "intro") return renderIntroSection();
  if (currentSection === "gallery") return renderGallerySection();
  if (currentSection === "cards") return renderCardsSection();
  if (currentSection === "timeline") return renderTimelineSection();
  if (currentSection === "visit") return renderVisitSection();
  if (currentSection === "admins") return renderAdminsSection();
}

function setSectionMeta(title, help) {
  sectionTitle.textContent = title;
  sectionHelp.textContent = help;
  formRoot.innerHTML = "";
}

function renderMenuSection() {
  setSectionMeta("Menu principal", "Canvia els noms i enllaços del menu superior.");

  state.navLinks.forEach((item, i) => {
    const box = group(`Opció ${i + 1}`);
    box.appendChild(textField("Nom", item.label, (v) => (state.navLinks[i].label = v)));
    box.appendChild(textField("Enllaç", item.href, (v) => (state.navLinks[i].href = v)));

    const check = document.createElement("label");
    check.innerHTML = `Resaltat <input type="checkbox" ${item.active ? "checked" : ""} />`;
    check.querySelector("input").addEventListener("change", (e) => (state.navLinks[i].active = e.target.checked));
    box.appendChild(check);
    formRoot.appendChild(box);
  });
}

function renderHeroSection() {
  setSectionMeta("Portada", "Canvia les 2 imatges principals del slider.");
  state.heroSlides.forEach((url, i) => {
    const box = group(`Slide ${i + 1}`);
    box.appendChild(textField("URL imatge", url, (v) => (state.heroSlides[i] = v)));
    box.appendChild(imagePreview(state.heroSlides[i]));
    formRoot.appendChild(box);
  });
}

function renderIntroSection() {
  setSectionMeta("Introducció", "Edita el text principal.");
  const box = group("Text principal");
  box.appendChild(textField("Títol", state.intro.title, (v) => (state.intro.title = v)));
  box.appendChild(textAreaField("Descripció", state.intro.description, (v) => (state.intro.description = v)));
  formRoot.appendChild(box);
}

function renderGallerySection() {
  setSectionMeta("Galeria", "Imatges sota la introducció.");
  state.introGallery.forEach((item, i) => {
    const box = group(`Imatge ${i + 1}`);
    box.appendChild(textField("URL imatge", item.src, (v) => (state.introGallery[i].src = v)));
    box.appendChild(textField("Text alternatiu", item.alt, (v) => (state.introGallery[i].alt = v)));
    const vertical = document.createElement("label");
    vertical.innerHTML = `Imatge vertical <input type="checkbox" ${item.tall ? "checked" : ""} />`;
    vertical.querySelector("input").addEventListener("change", (e) => (state.introGallery[i].tall = e.target.checked));
    box.appendChild(vertical);
    box.appendChild(imagePreview(item.src));
    formRoot.appendChild(box);
  });
}

function renderCardsSection() {
  setSectionMeta("Blocs", "Blocs de la secció “Què hi trobarem?”.");
  state.cards.forEach((item, i) => {
    const box = group(`Bloc ${i + 1}`);
    box.appendChild(textField("Títol", item.title, (v) => (state.cards[i].title = v)));
    box.appendChild(textAreaField("Text", item.text, (v) => (state.cards[i].text = v)));
    box.appendChild(textField("URL imatge", item.image, (v) => (state.cards[i].image = v)));
    box.appendChild(textField("Text alternatiu", item.alt, (v) => (state.cards[i].alt = v)));
    box.appendChild(imagePreview(item.image));
    formRoot.appendChild(box);
  });
}

function renderTimelineSection() {
  setSectionMeta("Timeline", "Punts de la secció “Què s'hi inclou?”.");

  state.timelineItems.forEach((item, i) => {
    const box = group(`Punt ${i + 1}`);

    const side = document.createElement("label");
    side.innerHTML = `Costat<select><option value="left">Esquerra</option><option value="right">Dreta</option></select>`;
    side.querySelector("select").value = item.side;
    side.querySelector("select").addEventListener("change", (e) => (state.timelineItems[i].side = e.target.value));

    const icon = document.createElement("label");
    icon.innerHTML = `Icona<select>${ICON_OPTIONS.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join("")}</select>`;
    icon.querySelector("select").value = item.iconClass;
    icon.querySelector("select").addEventListener("change", (e) => (state.timelineItems[i].iconClass = e.target.value));

    box.appendChild(side);
    box.appendChild(icon);
    box.appendChild(textField("Títol curt", item.label, (v) => (state.timelineItems[i].label = v)));
    box.appendChild(textField("Subtítol", item.subLabel, (v) => (state.timelineItems[i].subLabel = v)));
    box.appendChild(textField("Títol gran", item.title, (v) => (state.timelineItems[i].title = v)));
    box.appendChild(textAreaField("Descripció", item.description, (v) => (state.timelineItems[i].description = v)));

    formRoot.appendChild(box);
  });
}

function renderVisitSection() {
  setSectionMeta("Secció final", "Bloc final “Veniu a gaudir!”.");
  const box = group("Contingut final");
  box.appendChild(textField("Títol", state.visit.title, (v) => (state.visit.title = v)));
  box.appendChild(textAreaField("Adreça", state.visit.address, (v) => (state.visit.address = v)));
  box.appendChild(textField("URL imatge fons", state.visit.backgroundImage, (v) => (state.visit.backgroundImage = v)));
  box.appendChild(imagePreview(state.visit.backgroundImage));
  formRoot.appendChild(box);
}

function renderAdminsSection() {
  setSectionMeta("Admins", "Activa o desactiva qui pot entrar.");
  const wrap = document.createElement("div");

  ACCOUNTS.filter((a) => a.role === "admin").forEach((admin) => {
    const row = document.createElement("div");
    row.className = "switch-row";
    const enabled = adminStatus[admin.user] !== false;

    row.innerHTML = `
      <strong>${admin.user}</strong>
      <label><input type="checkbox" ${enabled ? "checked" : ""} /> ${enabled ? "Actiu" : "Inactiu"}</label>
    `;

    row.querySelector("input").addEventListener("change", (e) => {
      adminStatus[admin.user] = e.target.checked;
      saveAdminStatus(adminStatus);
      renderAdminsSection();
    });

    wrap.appendChild(row);
  });

  formRoot.appendChild(wrap);
}

function normalizeState(raw) {
  const defaults = cloneDefaultSiteData();
  const out = { ...defaults, ...(raw || {}) };

  out.navLinks = ensureLen(raw?.navLinks, defaults.navLinks);
  out.heroSlides = ensureLen(raw?.heroSlides, defaults.heroSlides);
  out.introGallery = ensureLen(raw?.introGallery, defaults.introGallery);
  out.cards = ensureLen(raw?.cards, defaults.cards);
  out.timelineItems = ensureLen(raw?.timelineItems, defaults.timelineItems);
  out.intro = { ...defaults.intro, ...(raw?.intro || {}) };
  out.visit = { ...defaults.visit, ...(raw?.visit || {}) };

  return out;
}

function ensureLen(arr, defaults) {
  if (!Array.isArray(arr)) return JSON.parse(JSON.stringify(defaults));
  const base = JSON.parse(JSON.stringify(defaults));
  for (let i = 0; i < base.length; i += 1) {
    if (arr[i]) base[i] = { ...base[i], ...arr[i] };
  }
  return base;
}

function group(title) {
  const box = document.createElement("div");
  box.className = "group";
  box.innerHTML = `<h3>${title}</h3>`;
  return box;
}

function textField(label, value, onChange, type = "text") {
  const el = document.createElement("label");
  el.innerHTML = `${label}<input type="${type}" value="${escapeHtml(value ?? "")}" />`;
  el.querySelector("input").addEventListener("input", (e) => onChange(e.target.value));
  return el;
}

function textAreaField(label, value, onChange) {
  const el = document.createElement("label");
  el.innerHTML = `${label}<textarea>${escapeHtml(value ?? "")}</textarea>`;
  el.querySelector("textarea").addEventListener("input", (e) => onChange(e.target.value));
  return el;
}

function imagePreview(url) {
  const img = document.createElement("img");
  img.className = "preview";
  img.alt = "Preview";
  img.src = url || "https://dummyimage.com/800x320/e8edf8/7582a4&text=Sense+imatge";
  return img;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
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
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (_err) {
    return defaults;
  }
}

function saveAdminStatus(status) {
  localStorage.setItem(ADMIN_STATUS_KEY, JSON.stringify(status));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
