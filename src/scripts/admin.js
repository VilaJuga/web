
import { getSiteData, saveSiteData, resetSiteData } from "./modules/data-store.js";

const AUTH_USER = "Marc";
const AUTH_PWD = "1701";

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
const toast = document.getElementById("toast");

let state = getSiteData();

loginBtn.addEventListener("click", () => {
  if (userInput.value === AUTH_USER && pwdInput.value === AUTH_PWD) {
    loginCard.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderEditor();
    return;
  }

  loginError.textContent = "Credencials incorrectes.";
});

saveBtn.addEventListener("click", () => {
  saveSiteData(state);
  showToast("Canvis guardats. Recarrega la web principal.");
});

resetBtn.addEventListener("click", () => {
  state = resetSiteData();
  saveSiteData(state);
  renderEditor();
  showToast("Dades restaurades a valors per defecte.");
});

openSiteBtn.addEventListener("click", () => {
  window.open("./index.html", "_blank");
});

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

function panel(title) {
  const wrap = document.createElement("section");
  wrap.className = "panel";
  wrap.innerHTML = `<h3>${title}</h3>`;
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
  const wrap = panel("Menú");
  const list = document.createElement("div");
  list.className = "repeater";

  state.navLinks.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Link ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.navLinks.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("Texto", item.label, (v) => (state.navLinks[index].label = v)));
    row.appendChild(textField("URL", item.href, (v) => (state.navLinks[index].href = v)));

    const check = document.createElement("label");
    check.innerHTML = `Activo <input type="checkbox" ${item.active ? "checked" : ""} />`;
    check.querySelector("input").addEventListener("change", (e) => {
      state.navLinks[index].active = e.target.checked;
    });
    row.appendChild(check);

    list.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "add";
  add.textContent = "Añadir enlace";
  add.type = "button";
  add.addEventListener("click", () => {
    state.navLinks.push({ label: "Nou link", href: "#", active: false });
    renderEditor();
  });

  wrap.appendChild(list);
  wrap.appendChild(add);
  return wrap;
}

function buildHeroPanel() {
  const wrap = panel("Slider Hero");
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

    row.appendChild(textField("Imagen URL", url, (v) => (state.heroSlides[index] = v)));
    row.appendChild(imagePreview(url));
    list.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "add";
  add.textContent = "Añadir slide";
  add.type = "button";
  add.addEventListener("click", () => {
    state.heroSlides.push("");
    renderEditor();
  });

  wrap.appendChild(list);
  wrap.appendChild(add);
  return wrap;
}

function buildIntroPanel() {
  const wrap = panel("Intro");
  wrap.appendChild(textField("Título", state.intro.title, (v) => (state.intro.title = v)));
  wrap.appendChild(textAreaField("Descripción", state.intro.description, (v) => (state.intro.description = v)));
  return wrap;
}

function buildGalleryPanel() {
  const wrap = panel("Galería Intro");
  const list = document.createElement("div");
  list.className = "repeater";

  state.introGallery.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Imagen ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.introGallery.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("Imagen URL", item.src, (v) => (state.introGallery[index].src = v)));
    row.appendChild(textField("Alt", item.alt, (v) => (state.introGallery[index].alt = v)));

    const check = document.createElement("label");
    check.innerHTML = `Imagen alta <input type="checkbox" ${item.tall ? "checked" : ""} />`;
    check.querySelector("input").addEventListener("change", (e) => {
      state.introGallery[index].tall = e.target.checked;
    });
    row.appendChild(check);

    row.appendChild(imagePreview(item.src));
    list.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "add";
  add.textContent = "Añadir imagen";
  add.type = "button";
  add.addEventListener("click", () => {
    state.introGallery.push({ src: "", alt: "", tall: false });
    renderEditor();
  });

  wrap.appendChild(list);
  wrap.appendChild(add);
  return wrap;
}

function buildCardsPanel() {
  const wrap = panel("Cards (Què hi trobarem?)");
  const list = document.createElement("div");
  list.className = "repeater";

  state.cards.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Card ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.cards.splice(index, 1);
      renderEditor();
    });

    row.appendChild(textField("Título", item.title, (v) => (state.cards[index].title = v)));
    row.appendChild(textField("Imagen URL", item.image, (v) => (state.cards[index].image = v)));
    row.appendChild(textField("Alt", item.alt, (v) => (state.cards[index].alt = v)));
    row.appendChild(textAreaField("Texto", item.text, (v) => (state.cards[index].text = v)));
    row.appendChild(imagePreview(item.image));
    list.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "add";
  add.textContent = "Añadir card";
  add.type = "button";
  add.addEventListener("click", () => {
    state.cards.push({ title: "", image: "", alt: "", text: "" });
    renderEditor();
  });

  wrap.appendChild(list);
  wrap.appendChild(add);
  return wrap;
}

function buildTimelinePanel() {
  const wrap = panel("Timeline (Què s'hi inclou?)");
  const list = document.createElement("div");
  list.className = "repeater";

  state.timelineItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div class="item-head"><strong>Item ${index + 1}</strong><button class="remove" type="button">Eliminar</button></div>`;
    row.querySelector(".remove").addEventListener("click", () => {
      state.timelineItems.splice(index, 1);
      renderEditor();
    });

    const side = document.createElement("label");
    side.innerHTML = `Lado<select><option value="left">left</option><option value="right">right</option></select>`;
    side.querySelector("select").value = item.side;
    side.querySelector("select").addEventListener("change", (e) => (state.timelineItems[index].side = e.target.value));

    row.appendChild(side);
    row.appendChild(textField("Label", item.label, (v) => (state.timelineItems[index].label = v)));
    row.appendChild(textField("SubLabel", item.subLabel, (v) => (state.timelineItems[index].subLabel = v)));
    row.appendChild(textField("Icon class", item.iconClass, (v) => (state.timelineItems[index].iconClass = v)));
    row.appendChild(textField("Título", item.title, (v) => (state.timelineItems[index].title = v)));
    row.appendChild(textAreaField("Descripción", item.description, (v) => (state.timelineItems[index].description = v)));

    list.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "add";
  add.textContent = "Añadir item timeline";
  add.type = "button";
  add.addEventListener("click", () => {
    state.timelineItems.push({
      side: "left",
      label: "",
      subLabel: "",
      iconClass: "fas fa-dice",
      title: "",
      description: ""
    });
    renderEditor();
  });

  wrap.appendChild(list);
  wrap.appendChild(add);
  return wrap;
}

function buildVisitPanel() {
  const wrap = panel("Secció final (Veniu a gaudir)");
  wrap.appendChild(textField("Título", state.visit.title, (v) => (state.visit.title = v)));
  wrap.appendChild(textAreaField("Dirección", state.visit.address, (v) => (state.visit.address = v)));
  wrap.appendChild(textField("Imagen fondo URL", state.visit.backgroundImage, (v) => (state.visit.backgroundImage = v)));
  wrap.appendChild(imagePreview(state.visit.backgroundImage));
  return wrap;
}

function imagePreview(url) {
  const img = document.createElement("img");
  img.className = "preview";
  img.alt = "Preview";
  img.src = url || "https://dummyimage.com/800x320/e8edf8/7582a4&text=Sense+imatge";
  return img;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
