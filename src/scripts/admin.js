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
const editorRoot = document.getElementById("editorRoot");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const openSiteBtn = document.getElementById("openSiteBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");
const roleBadge = document.getElementById("roleBadge");
const welcomeText = document.getElementById("welcomeText");
const superAdminPanel = document.getElementById("superAdminPanel");
const adminUsers = document.getElementById("adminUsers");

let state = getSiteData();
let adminStatus = getAdminStatus();

loginBtn.addEventListener("click", () => {
  const account = findAccount(userInput.value, pwdInput.value);

  if (!account) {
    loginError.textContent = "Credencials incorrectes.";
    return;
  }

  if (account.role === "admin" && adminStatus[account.user] === false) {
    loginError.textContent = "Aquest usuari està inhabilitat per un superadmin.";
    return;
  }

  loginError.textContent = "";
  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  roleBadge.textContent = account.role === "superadmin" ? "Superadmin" : "Admin";
  welcomeText.textContent = `Sessió iniciada com ${account.user}.`;

  const isSuper = account.role === "superadmin";
  superAdminPanel.classList.toggle("hidden", !isSuper);
  if (isSuper) renderSuperAdminPanel();

  renderEditor();
});

pwdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});

saveBtn.addEventListener("click", () => {
  saveSiteData(state);
  showToast("Canvis guardats. Recarrega la web principal.");
});

resetBtn.addEventListener("click", () => {
  state = resetSiteData();
  renderEditor();
  showToast("Dades restaurades a valors per defecte.");
});

openSiteBtn.addEventListener("click", () => {
  window.open("./index.html", "_blank");
});

logoutBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  userInput.value = "";
  pwdInput.value = "";
  loginError.textContent = "";
  roleBadge.textContent = "";
  superAdminPanel.classList.add("hidden");
});

function renderSuperAdminPanel() {
  adminUsers.innerHTML = "";

  const admins = ACCOUNTS.filter((a) => a.role === "admin");
  admins.forEach((admin) => {
    const row = document.createElement("div");
    row.className = "admin-user-row";

    const enabled = adminStatus[admin.user] !== false;

    row.innerHTML = `
      <strong>${admin.user}</strong>
      <label class="switch-wrap">
        <input type="checkbox" ${enabled ? "checked" : ""} />
        <span>${enabled ? "Habilitat" : "Inhabilitat"}</span>
      </label>
    `;

    row.querySelector("input").addEventListener("change", (e) => {
      adminStatus[admin.user] = e.target.checked;
      saveAdminStatus(adminStatus);
      renderSuperAdminPanel();
    });

    adminUsers.appendChild(row);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderEditor() {
  editorRoot.innerHTML = "";

  editorRoot.appendChild(buildNavPanel());
  editorRoot.appendChild(buildHeroPanel());
  editorRoot.appendChild(buildIntroPanel());
  editorRoot.appendChild(buildGalleryPanel());
  editorRoot.appendChild(buildCardsPanel());
  editorRoot.appendChild(buildTimelinePanel());
  editorRoot.appendChild(buildVisitPanel());
}

function panel(title, helpText = "") {
  const wrap = document.createElement("section");
  wrap.className = "panel";
  wrap.innerHTML = `<h3>${title}</h3>${helpText ? `<p class="panel-help">${helpText}</p>` : ""}`;
  return wrap;
}

function textField(label, value, onChange, type = "text") {
  const el = document.createElement("label");
  el.innerHTML = `${label}<input type="${type}" value="${escapeHtml(value ?? "")}" />`;
  const input = el.querySelector("input");
  input.addEventListener("input", (e) => onChange(e.target.value));
  return el;
}

function textAreaField(label, value, onChange) {
  const el = document.createElement("label");
  el.innerHTML = `${label}<textarea>${escapeHtml(value ?? "")}</textarea>`;
  const input = el.querySelector("textarea");
  input.addEventListener("input", (e) => onChange(e.target.value));
  return el;
}

function buildNavPanel() {
  const wrap = panel("Menu principal", "Text i enllaços de la barra superior.");
  const list = document.createElement("div");
  list.className = "repeater";

  state.navLinks.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Opció ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.navLinks.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("Nom", item.label, (v) => (state.navLinks[index].label = v)));
    row.appendChild(textField("Enllaç", item.href, (v) => (state.navLinks[index].href = v)));

    const check = document.createElement("label");
    check.innerHTML = `Resaltat <input type="checkbox" ${item.active ? "checked" : ""} />`;
    check.querySelector("input").addEventListener("change", (e) => {
      state.navLinks[index].active = e.target.checked;
    });
    row.appendChild(check);

    list.appendChild(row);
  });

  wrap.appendChild(list);
  wrap.appendChild(addButton("Afegir opció", () => {
    state.navLinks.push({ label: "Nou enllaç", href: "#", active: false });
    renderEditor();
  }));
  return wrap;
}

function buildHeroPanel() {
  const wrap = panel("Slider principal", "Imatges grans de la capçalera.");
  const list = document.createElement("div");
  list.className = "repeater";

  state.heroSlides.forEach((url, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Slide ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.heroSlides.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("URL imatge", url, (v) => (state.heroSlides[index] = v)));
    row.appendChild(imagePreview(url));
    list.appendChild(row);
  });

  wrap.appendChild(list);
  wrap.appendChild(addButton("Afegir slide", () => {
    state.heroSlides.push("");
    renderEditor();
  }));
  return wrap;
}

function buildIntroPanel() {
  const wrap = panel("Text d'introducció");
  wrap.appendChild(textField("Títol principal", state.intro.title, (v) => (state.intro.title = v)));
  wrap.appendChild(textAreaField("Descripció", state.intro.description, (v) => (state.intro.description = v)));
  return wrap;
}

function buildGalleryPanel() {
  const wrap = panel("Galeria inicial", "Imatges sota el text principal.");
  const list = document.createElement("div");
  list.className = "repeater";

  state.introGallery.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Imatge ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.introGallery.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("URL imatge", item.src, (v) => (state.introGallery[index].src = v)));
    row.appendChild(textField("Text alternatiu", item.alt, (v) => (state.introGallery[index].alt = v)));

    const check = document.createElement("label");
    check.innerHTML = `Imatge vertical <input type="checkbox" ${item.tall ? "checked" : ""} />`;
    check.querySelector("input").addEventListener("change", (e) => {
      state.introGallery[index].tall = e.target.checked;
    });
    row.appendChild(check);

    row.appendChild(imagePreview(item.src));
    list.appendChild(row);
  });

  wrap.appendChild(list);
  wrap.appendChild(addButton("Afegir imatge", () => {
    state.introGallery.push({ src: "", alt: "", tall: false });
    renderEditor();
  }));
  return wrap;
}

function buildCardsPanel() {
  const wrap = panel("Blocs “Què hi trobarem?”");
  const list = document.createElement("div");
  list.className = "repeater";

  state.cards.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Bloc ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.cards.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("Títol", item.title, (v) => (state.cards[index].title = v)));
    row.appendChild(textField("URL imatge", item.image, (v) => (state.cards[index].image = v)));
    row.appendChild(textField("Text alternatiu", item.alt, (v) => (state.cards[index].alt = v)));
    row.appendChild(textAreaField("Text", item.text, (v) => (state.cards[index].text = v)));
    row.appendChild(imagePreview(item.image));
    list.appendChild(row);
  });

  wrap.appendChild(list);
  wrap.appendChild(addButton("Afegir bloc", () => {
    state.cards.push({ title: "", image: "", alt: "", text: "" });
    renderEditor();
  }));
  return wrap;
}

function buildTimelinePanel() {
  const wrap = panel("Blocs “Què s'hi inclou?”", "Canvia text i icona dels punts del timeline.");
  const list = document.createElement("div");
  list.className = "repeater";

  state.timelineItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Punt ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.timelineItems.splice(index, 1);
      renderEditor();
    });

    const side = document.createElement("label");
    side.innerHTML = `Costat<select><option value="left">Esquerra</option><option value="right">Dreta</option></select>`;
    side.querySelector("select").value = item.side;
    side.querySelector("select").addEventListener("change", (e) => (state.timelineItems[index].side = e.target.value));

    const icon = document.createElement("label");
    icon.innerHTML = `Icona<select>${ICON_OPTIONS.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join("")}</select>`;
    icon.querySelector("select").value = item.iconClass;
    icon.querySelector("select").addEventListener("change", (e) => (state.timelineItems[index].iconClass = e.target.value));

    row.appendChild(side);
    row.appendChild(icon);
    row.appendChild(textField("Títol curt", item.label, (v) => (state.timelineItems[index].label = v)));
    row.appendChild(textField("Subtítol", item.subLabel, (v) => (state.timelineItems[index].subLabel = v)));
    row.appendChild(textField("Títol gran", item.title, (v) => (state.timelineItems[index].title = v)));
    row.appendChild(textAreaField("Descripció", item.description, (v) => (state.timelineItems[index].description = v)));

    list.appendChild(row);
  });

  wrap.appendChild(list);
  wrap.appendChild(addButton("Afegir punt", () => {
    state.timelineItems.push({
      side: "left",
      label: "",
      subLabel: "",
      iconClass: "fas fa-dice",
      title: "",
      description: "",
    });
    renderEditor();
  }));
  return wrap;
}

function buildVisitPanel() {
  const wrap = panel("Secció final “Veniu a gaudir!”");
  wrap.appendChild(textField("Títol", state.visit.title, (v) => (state.visit.title = v)));
  wrap.appendChild(textAreaField("Adreça", state.visit.address, (v) => (state.visit.address = v)));
  wrap.appendChild(textField("URL imatge de fons", state.visit.backgroundImage, (v) => (state.visit.backgroundImage = v)));
  wrap.appendChild(imagePreview(state.visit.backgroundImage));
  return wrap;
}

function addButton(text, onClick) {
  const add = document.createElement("button");
  add.className = "add";
  add.textContent = text;
  add.type = "button";
  add.addEventListener("click", onClick);
  return add;
}

function imagePreview(url) {
  const img = document.createElement("img");
  img.className = "preview";
  img.alt = "Preview";
  img.src = url || "https://dummyimage.com/800x320/e8edf8/7582a4&text=Sense+imatge";
  return img;
}

function findAccount(inputUser, inputPwd) {
  const normalized = normalizeUser(inputUser);
  return ACCOUNTS.find(
    (acc) => normalizeUser(acc.user) === normalized && acc.pwd === inputPwd
  );
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
  ACCOUNTS.filter((a) => a.role === "admin").forEach((a) => {
    defaults[a.user] = true;
  });

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
