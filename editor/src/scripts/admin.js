
const EDITOR_STORE_KEY = "vilajuga_visual_editor_v3";
const LEGACY_EDITS_KEY = "vilajuga_page_edits_v1";
const ADMIN_STATUS_KEY = "vilajuga_admin_status_v1";

const ACCOUNTS = [
  { user: "Marc", pwd: "1701", role: "admin" },
  { user: "Aleix", pwd: "1234", role: "admin" },
  { user: "Miriam", pwd: "1234", role: "admin" },
  { user: "Joan", pwd: "1234", role: "admin" },
  { user: "Miki", pwd: "1234", role: "admin" },
  { user: "Genis", pwd: "1234", role: "admin" },
  { user: "Sergi", pwd: "1234", role: "admin" },
  { user: "DaVinci", pwd: "HVitruviano", role: "superadmin" },
];

const BASE_PAGES = [
  { key: "main/index.html", label: "Inicio", url: "../main/index.html", status: "publicada" },
  { key: "main/pages/actividades-2026.html", label: "Actividades 2026", url: "../main/pages/actividades-2026.html", status: "publicada" },
  { key: "main/pages/ludoteca.html", label: "Ludoteca", url: "../main/pages/ludoteca.html", status: "publicada" },
  { key: "main/pages/sobre-nosotros.html", label: "Sobre nosotros", url: "../main/pages/sobre-nosotros.html", status: "publicada" },
  { key: "main/pages/contacto.html", label: "Contacto", url: "../main/pages/contacto.html", status: "publicada" },
  { key: "main/pages/como-llegar.html", label: "Como llegar", url: "../main/pages/como-llegar.html", status: "publicada" },
];

const BLOCK_LIBRARY = {
  basic: [
    { type: "texto", icon: "📝", name: "Texto", description: "Parrafo editable" },
    { type: "imagen", icon: "🖼️", name: "Imagen", description: "Imagen con pie" },
    { type: "lista", icon: "📋", name: "Lista", description: "Lista de puntos" },
    { type: "linea", icon: "━━", name: "Linea", description: "Separador" },
    { type: "enlace", icon: "🔗", name: "Enlace/Boton", description: "Boton con enlace" },
    { type: "video", icon: "📺", name: "Video", description: "Video incrustado" },
  ],
  vilajuga: [
    { type: "noticia", icon: "📰", name: "Noticia", description: "Imagen + titulo + fecha + texto" },
    { type: "evento", icon: "📅", name: "Evento", description: "Fecha + hora + lugar" },
    { type: "miembro", icon: "👥", name: "Miembro Junta", description: "Foto + datos de contacto" },
    { type: "galeria", icon: "🖼️", name: "Galeria", description: "Grid de imagenes" },
  ],
};

const loginView = document.getElementById("loginView");
const editorView = document.getElementById("editorView");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const saveState = document.getElementById("saveState");
const sessionLabel = document.getElementById("sessionLabel");
const roleBadge = document.getElementById("roleBadge");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");
const configBtn = document.getElementById("configBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const userMenuBtn = document.getElementById("userMenuBtn");
const userDropdown = document.getElementById("userDropdown");
const logoutBtn = document.getElementById("logoutBtn");

const pagePicker = document.getElementById("pagePicker");
const pageList = document.getElementById("pageList");
const newPageBtn = document.getElementById("newPageBtn");
const siteFrame = document.getElementById("siteFrame");

const tabButtons = [...document.querySelectorAll(".tab-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];
const blockSearch = document.getElementById("blockSearch");
const basicBlockList = document.getElementById("basicBlockList");
const vilajugaBlockList = document.getElementById("vilajugaBlockList");
const structureTree = document.getElementById("structureTree");
const refreshStructureBtn = document.getElementById("refreshStructureBtn");

const configPanel = document.getElementById("configPanel");
const configBody = document.getElementById("configBody");
const configType = document.getElementById("configType");
const backConfigBtn = document.getElementById("backConfigBtn");
const closeConfigBtn = document.getElementById("closeConfigBtn");
const applyConfigBtn = document.getElementById("applyConfigBtn");

const inlineToolbar = document.getElementById("inlineToolbar");
const linkBtn = document.getElementById("linkBtn");
const colorPicker = document.getElementById("colorPicker");
const inlineAccept = document.getElementById("inlineAccept");
const inlineCancel = document.getElementById("inlineCancel");

const imageModal = document.getElementById("imageModal");
const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const uploadPreview = document.getElementById("uploadPreview");
const imageLibraryGrid = document.getElementById("imageLibraryGrid");
const imageSearch = document.getElementById("imageSearch");
const selectImageBtn = document.getElementById("selectImageBtn");

const previewModal = document.getElementById("previewModal");
const previewFrame = document.getElementById("previewFrame");
const publishBtn = document.getElementById("publishBtn");

const pageSettingsModal = document.getElementById("pageSettingsModal");
const pageTitleInput = document.getElementById("pageTitleInput");
const pageSlugInput = document.getElementById("pageSlugInput");
const pageMetaInput = document.getElementById("pageMetaInput");
const savePageSettingsBtn = document.getElementById("savePageSettingsBtn");

const toast = document.getElementById("toast");

let currentAccount = null;
let currentPageKey = BASE_PAGES[0].key;
let selectedTarget = null;
let inlineState = null;
let pendingImageTarget = null;
let selectedImageId = null;
let dirty = false;
let autosaveTimer = null;
let clipboardBlock = null;
let lastSavedAt = Date.now();

const historyByPage = {};

let store = loadStore();
let adminStatus = loadAdminStatus();

bindEvents();
renderBlockLists();

function bindEvents() {
  loginBtn.addEventListener("click", onLogin);
  loginPass.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onLogin();
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });

  blockSearch.addEventListener("input", renderBlockLists);
  refreshStructureBtn.addEventListener("click", renderStructure);

  pagePicker.addEventListener("change", () => {
    currentPageKey = pagePicker.value;
    selectedTarget = null;
    hideConfigPanel();
    loadFrame();
    renderPagesTab();
  });

  saveBtn.addEventListener("click", () => saveNow(true));
  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);
  previewBtn.addEventListener("click", openPreview);
  configBtn.addEventListener("click", openPageSettings);

  userMenuBtn.addEventListener("click", () => {
    userDropdown.classList.toggle("hidden");
  });

  logoutBtn.addEventListener("click", logout);

  backConfigBtn.addEventListener("click", hideConfigPanel);
  closeConfigBtn.addEventListener("click", hideConfigPanel);
  applyConfigBtn.addEventListener("click", applyConfigChanges);

  [...inlineToolbar.querySelectorAll("button[data-cmd]")].forEach((button) => {
    button.addEventListener("click", () => execInlineCommand(button.dataset.cmd));
  });

  [...inlineToolbar.querySelectorAll("button[data-heading]")].forEach((button) => {
    button.addEventListener("click", () => execInlineCommand("formatBlock", button.dataset.heading));
  });

  [...inlineToolbar.querySelectorAll("button[data-align]")].forEach((button) => {
    button.addEventListener("click", () => {
      const align = button.dataset.align;
      if (align === "left") execInlineCommand("justifyLeft");
      if (align === "center") execInlineCommand("justifyCenter");
      if (align === "right") execInlineCommand("justifyRight");
    });
  });

  linkBtn.addEventListener("click", () => {
    if (!inlineState) return;
    const url = prompt("Introduce la URL del enlace", "https://");
    if (!url) return;
    execInlineCommand("createLink", url);
  });

  colorPicker.addEventListener("input", () => {
    execInlineCommand("foreColor", colorPicker.value);
  });

  inlineAccept.addEventListener("click", commitInlineEdit);
  inlineCancel.addEventListener("click", cancelInlineEdit);

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.closeModal);
      modal.classList.add("hidden");
    });
  });

  document.querySelectorAll(".modal-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.imageTab;
      document.querySelectorAll(".modal-tab").forEach((item) => item.classList.toggle("active", item === button));
      document.getElementById("imageUploadTab").classList.toggle("active", target === "upload");
      document.getElementById("imageLibraryTab").classList.toggle("active", target === "library");
    });
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
    handleFiles(event.dataTransfer.files);
  });

  imageInput.addEventListener("change", (event) => handleFiles(event.target.files));
  imageSearch.addEventListener("input", renderImageLibrary);
  selectImageBtn.addEventListener("click", applySelectedImage);

  [...document.querySelectorAll(".device-btn")].forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".device-btn").forEach((item) => item.classList.toggle("active", item === button));
      const device = button.dataset.device;
      if (device === "desktop") previewFrame.style.width = "100%";
      if (device === "tablet") previewFrame.style.width = "834px";
      if (device === "mobile") previewFrame.style.width = "390px";
    });
  });

  publishBtn.addEventListener("click", () => {
    const ok = confirm("¿Publicar cambios en vilajuga.org?");
    if (!ok) return;
    saveNow(true);
    previewModal.classList.add("hidden");
    showToast("Cambios publicados.");
  });

  savePageSettingsBtn.addEventListener("click", savePageSettings);
  newPageBtn.addEventListener("click", createNewDraftPage);
  window.addEventListener("keydown", handleShortcuts);

  window.addEventListener("click", (event) => {
    if (!event.target.closest(".user-menu-wrap")) userDropdown.classList.add("hidden");
  });
}

function onLogin() {
  const account = findAccount(loginUser.value, loginPass.value);
  if (!account) {
    loginError.textContent = "Usuario o contraseña incorrectos.";
    return;
  }

  if (account.role === "admin" && adminStatus[account.user] === false) {
    loginError.textContent = "Este usuario esta desactivado.";
    return;
  }

  currentAccount = account;
  loginError.textContent = "";
  loginView.classList.add("hidden");
  editorView.classList.remove("hidden");

  sessionLabel.textContent = account.user;
  roleBadge.textContent = account.role === "superadmin" ? "Superadmin" : "Administrador";

  ensureStoreShape();
  migrateLegacyEdits();
  renderPagesPicker();
  renderPagesTab();
  loadFrame();
  startAutosave();
}

function logout() {
  stopAutosave();
  currentAccount = null;
  selectedTarget = null;
  inlineState = null;
  hideInlineToolbar();
  hideConfigPanel();
  editorView.classList.add("hidden");
  loginView.classList.remove("hidden");
  loginUser.value = "";
  loginPass.value = "";
  saveState.textContent = "💾 Sin cambios";
}

function ensureStoreShape() {
  store.pages ||= {};
  store.pagesMeta ||= [...BASE_PAGES];
  store.uploads ||= [];

  BASE_PAGES.forEach((page) => {
    if (!store.pagesMeta.find((item) => item.key === page.key)) store.pagesMeta.push({ ...page });
  });

  saveStore();
}

function setActiveTab(tab) {
  tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `tab${capitalize(tab)}`));
}

function renderBlockLists() {
  const query = blockSearch.value.trim().toLowerCase();
  basicBlockList.innerHTML = "";
  vilajugaBlockList.innerHTML = "";

  BLOCK_LIBRARY.basic
    .filter((block) => block.name.toLowerCase().includes(query) || block.description.toLowerCase().includes(query))
    .forEach((block) => basicBlockList.appendChild(makeBlockCard(block)));

  BLOCK_LIBRARY.vilajuga
    .filter((block) => block.name.toLowerCase().includes(query) || block.description.toLowerCase().includes(query))
    .forEach((block) => vilajugaBlockList.appendChild(makeBlockCard(block)));
}

function makeBlockCard(block) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "block-card";
  card.innerHTML = `<strong>${block.icon} ${block.name}</strong><span>${block.description}</span>`;
  card.addEventListener("click", () => addBlock(block.type));
  return card;
}

function renderPagesPicker() {
  const pages = getPagesMeta();
  pagePicker.innerHTML = pages.map((page) => `<option value="${page.key}">${page.label}</option>`).join("");
  if (!pages.find((page) => page.key === currentPageKey)) currentPageKey = pages[0]?.key || "main/index.html";
  pagePicker.value = currentPageKey;
}

function renderPagesTab() {
  const pages = getPagesMeta();
  pageList.innerHTML = "";

  pages.forEach((page) => {
    const row = document.createElement("div");
    row.className = "page-item";
    if (page.key === currentPageKey) row.style.borderColor = "#1976d2";

    const info = document.createElement("div");
    info.innerHTML = `<strong>${page.label}</strong><br><span>${page.url}</span><br><small>${page.status}</small>`;
    info.style.cursor = "pointer";
    info.addEventListener("click", () => {
      currentPageKey = page.key;
      pagePicker.value = page.key;
      loadFrame();
      renderPagesTab();
    });

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "4px";

    const duplicate = document.createElement("button");
    duplicate.type = "button";
    duplicate.textContent = "Duplicar";
    duplicate.addEventListener("click", () => duplicatePage(page.key));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Eliminar";
    remove.addEventListener("click", () => removePage(page.key));

    actions.append(duplicate, remove);
    row.append(info, actions);
    pageList.appendChild(row);
  });
}

function getCurrentPageMeta() {
  return getPagesMeta().find((page) => page.key === currentPageKey) || BASE_PAGES[0];
}

function getPagesMeta() {
  return store.pagesMeta || [];
}

function loadFrame() {
  const page = getCurrentPageMeta();
  siteFrame.src = `${page.url}?editor=${Date.now()}`;

  siteFrame.onload = () => {
    const doc = siteFrame.contentDocument;
    if (!doc) return;

    injectEditorStyles(doc);
    applyPageDataToDoc(doc, currentPageKey);
    wireDocumentForEditing(doc);
    renderStructure();
  };
}

function injectEditorStyles(doc) {
  if (doc.getElementById("vj-editor-style")) return;
  const style = doc.createElement("style");
  style.id = "vj-editor-style";
  style.textContent = `
    .vj-editable-node:hover { outline: 2px solid #2196f3 !important; outline-offset: 2px; cursor: pointer; }
    .vj-editable-selected { outline: 2px solid #1976d2 !important; background: rgba(33,150,243,0.06) !important; }
    .vj-custom-block { border: 2px dashed transparent; border-radius: 8px; margin: 18px 0; padding: 14px; position: relative; }
    .vj-custom-block:hover { border-color: #2196f3; }
    .vj-custom-tools { position: absolute; top: -16px; right: 8px; display: none; gap: 6px; }
    .vj-custom-block:hover .vj-custom-tools, .vj-custom-block.vj-editable-selected .vj-custom-tools { display: flex; }
    .vj-custom-tools button { border: 1px solid #d7dce2; background: #fff; font-size: 12px; border-radius: 4px; padding: 2px 6px; cursor: pointer; }
    .vj-gallery-grid { display: grid; gap: 10px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .vj-gallery-grid img { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; }
    .vj-member { display: flex; gap: 14px; align-items: center; }
    .vj-member img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
    .vj-news img, .vj-event img { width: 100%; max-height: 260px; object-fit: cover; border-radius: 6px; }
  `;
  doc.head.appendChild(style);
}

function wireDocumentForEditing(doc) {
  const selector = "h1,h2,h3,h4,h5,h6,p,span,a,li,button,strong,em,small,label,img,section,article,div";
  const nodes = [...doc.querySelectorAll(selector)].filter((node) => {
    if (node.closest("script,style,noscript")) return false;
    if (node.classList.contains("vj-custom-tools")) return false;
    return true;
  });

  nodes.forEach((node) => {
    node.classList.add("vj-editable-node");
    node.addEventListener("click", (event) => {
      if (event.target.closest(".vj-custom-tools")) return;
      event.preventDefault();
      event.stopPropagation();
      onNodeSelected(node);
    });

    if (isInlineTextNode(node)) {
      node.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        startInlineEdit(node);
      });
    }
  });

  doc.addEventListener("click", () => {
    if (!inlineState) clearSelection();
  });

  mountCustomToolbars(doc);
}

function mountCustomToolbars(doc) {
  doc.querySelectorAll(".vj-custom-block").forEach((block) => {
    if (block.querySelector(".vj-custom-tools")) return;

    const tools = doc.createElement("div");
    tools.className = "vj-custom-tools";
    tools.innerHTML = `
      <button type="button" data-act="move-up">⋮⋮ ↑</button>
      <button type="button" data-act="config">⚙️</button>
      <button type="button" data-act="duplicate">📋</button>
      <button type="button" data-act="delete">🗑️</button>
    `;

    tools.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const id = block.dataset.vjCustomId;
        if (!id) return;
        onCustomToolAction(id, button.dataset.act);
      });
    });

    block.prepend(tools);
  });
}

function onCustomToolAction(id, action) {
  const page = getCurrentPageData();
  const index = page.customBlocks.findIndex((block) => block.id === id);
  if (index === -1) return;

  pushHistory();

  if (action === "delete") {
    const ok = confirm("¿Eliminar este bloque?");
    if (!ok) return;
    page.customBlocks.splice(index, 1);
    markDirty();
    loadFrame();
    return;
  }

  if (action === "duplicate") {
    const original = page.customBlocks[index];
    const clone = cloneData(original);
    clone.id = uid("block");
    clone.anchor = original.anchor;
    page.customBlocks.splice(index + 1, 0, clone);
    markDirty();
    loadFrame();
    return;
  }

  if (action === "move-up" && index > 0) {
    const item = page.customBlocks[index];
    page.customBlocks.splice(index, 1);
    page.customBlocks.splice(index - 1, 0, item);
    markDirty();
    loadFrame();
    return;
  }

  if (action === "config") {
    const doc = siteFrame.contentDocument;
    const el = doc?.querySelector(`[data-vj-custom-id="${id}"]`);
    if (el) onNodeSelected(el);
  }
}
function onNodeSelected(node) {
  clearSelection();
  node.classList.add("vj-editable-selected");

  if (node.dataset.vjCustomId) {
    selectedTarget = { kind: "custom", id: node.dataset.vjCustomId, element: node };
  } else {
    selectedTarget = { kind: "node", selector: getSelectorPath(node), element: node };
  }

  renderStructure();
  openConfigPanel();
}

function clearSelection() {
  const doc = siteFrame.contentDocument;
  doc?.querySelectorAll(".vj-editable-selected").forEach((node) => node.classList.remove("vj-editable-selected"));
  selectedTarget = null;
}

function startInlineEdit(node) {
  if (!isInlineTextNode(node)) return;

  const selector = getSelectorPath(node);
  pushHistory();

  inlineState = { selector, node, before: node.innerHTML };
  node.setAttribute("contenteditable", "true");
  node.focus();

  const frameRect = siteFrame.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  inlineToolbar.style.left = `${frameRect.left + nodeRect.left}px`;
  inlineToolbar.style.top = `${frameRect.top + nodeRect.top - 44}px`;
  inlineToolbar.classList.remove("hidden");
}

function execInlineCommand(command, value = null) {
  if (!inlineState) return;
  inlineState.node.focus();
  siteFrame.contentDocument.execCommand(command, false, value);
}

function commitInlineEdit() {
  if (!inlineState) return;

  const selector = inlineState.selector;
  const node = inlineState.node;
  node.removeAttribute("contenteditable");

  const page = getCurrentPageData();
  page.nodes[selector] ||= {};
  page.nodes[selector].html = node.innerHTML;

  inlineState = null;
  hideInlineToolbar();
  markDirty();
  renderStructure();
}

function cancelInlineEdit() {
  if (!inlineState) return;
  inlineState.node.innerHTML = inlineState.before;
  inlineState.node.removeAttribute("contenteditable");
  inlineState = null;
  hideInlineToolbar();
}

function hideInlineToolbar() {
  inlineToolbar.classList.add("hidden");
}

function openConfigPanel() {
  if (!selectedTarget) return;
  configPanel.classList.remove("hidden");
  configBody.innerHTML = "";

  if (selectedTarget.kind === "custom") {
    const block = getCurrentPageData().customBlocks.find((item) => item.id === selectedTarget.id);
    if (!block) return;
    configType.textContent = `Bloque: ${block.type}`;
    renderCustomConfig(block);
    return;
  }

  const node = selectedTarget.element;
  const selector = selectedTarget.selector;
  const edits = getCurrentPageData().nodes[selector] || {};
  configType.textContent = `Elemento: ${node.tagName.toLowerCase()}`;

  const content = section("📝 CONTENIDO");
  if (isInlineTextNode(node)) content.appendChild(inputField("Texto/HTML", "node-html", edits.html ?? node.innerHTML, true));

  if (node.tagName === "IMG") {
    content.appendChild(inputField("URL imagen", "node-src", edits.src ?? node.getAttribute("src") || ""));
    content.appendChild(inputField("Alt", "node-alt", edits.alt ?? node.getAttribute("alt") || ""));
    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "mini-btn";
    imageButton.textContent = "Subir/Cambiar imagen";
    imageButton.addEventListener("click", () => openImageModal({ type: "node-image", selector }));
    content.appendChild(imageButton);
  }

  if (node.tagName === "A") content.appendChild(inputField("Enlace", "node-href", edits.href ?? node.getAttribute("href") || ""));
  configBody.appendChild(content);

  const style = section("🎨 ESTILO");
  style.appendChild(selectField("Alineacion", "node-align", edits.align || node.style.textAlign || "left", ["left", "center", "right"]));
  style.appendChild(inputField("Clase CSS", "node-class", edits.className ?? node.className || ""));
  style.appendChild(inputField("ID", "node-id", edits.id ?? node.id || ""));
  configBody.appendChild(style);

  const advanced = section("🔗 AVANZADO");
  const hiddenWrap = document.createElement("label");
  hiddenWrap.innerHTML = `<input id="node-hidden" type="checkbox" ${edits.hidden ? "checked" : ""} /> Ocultar bloque`;
  hiddenWrap.style.fontSize = "12px";
  advanced.appendChild(hiddenWrap);
  configBody.appendChild(advanced);
}

function hideConfigPanel() {
  configPanel.classList.add("hidden");
  configBody.innerHTML = "";
}

function renderCustomConfig(block) {
  const content = section("📝 CONTENIDO");
  Object.entries(block.data).forEach(([key, value]) => {
    if (Array.isArray(value)) return;
    if (typeof value === "string") {
      const multiline = key === "content" || key === "description" || key === "bio";
      content.appendChild(inputField(prettyName(key), `custom-${key}`, value, multiline));
    }
  });

  const imageSection = section("🖼️ IMAGEN");
  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.className = "mini-btn";
  imageButton.textContent = "Subir/Cambiar imagen";
  imageButton.addEventListener("click", () => openImageModal({ type: "custom-image", id: block.id }));
  imageSection.appendChild(imageButton);

  if (block.type === "galeria") {
    const galleryButton = document.createElement("button");
    galleryButton.type = "button";
    galleryButton.className = "mini-btn";
    galleryButton.style.marginLeft = "6px";
    galleryButton.textContent = "+ Añadir imagenes";
    galleryButton.addEventListener("click", () => openImageModal({ type: "custom-gallery", id: block.id }));
    imageSection.appendChild(galleryButton);
  }

  const style = section("🎨 ESTILO");
  style.appendChild(selectField("Alineacion", "custom-align", block.styles?.align || "left", ["left", "center", "right"]));
  style.appendChild(inputField("Tamano", "custom-size", block.styles?.size || "medium"));

  const advanced = section("🔗 AVANZADO");
  advanced.appendChild(inputField("ID personalizado", "custom-advanced-id", block.advanced?.id || ""));
  advanced.appendChild(inputField("Clase CSS", "custom-advanced-class", block.advanced?.className || ""));

  configBody.append(content, imageSection, style, advanced);
}

function applyConfigChanges() {
  if (!selectedTarget) return;
  pushHistory();

  if (selectedTarget.kind === "custom") {
    const page = getCurrentPageData();
    const block = page.customBlocks.find((item) => item.id === selectedTarget.id);
    if (!block) return;

    Object.keys(block.data).forEach((key) => {
      const input = document.getElementById(`custom-${key}`);
      if (input) block.data[key] = input.value;
    });

    block.styles ||= {};
    block.styles.align = document.getElementById("custom-align")?.value || "left";
    block.styles.size = document.getElementById("custom-size")?.value || "medium";
    block.advanced ||= {};
    block.advanced.id = document.getElementById("custom-advanced-id")?.value || "";
    block.advanced.className = document.getElementById("custom-advanced-class")?.value || "";

    markDirty();
    loadFrame();
    showToast("Bloque actualizado.");
    return;
  }

  const selector = selectedTarget.selector;
  const node = selectedTarget.element;
  const page = getCurrentPageData();
  page.nodes[selector] ||= {};
  const edit = page.nodes[selector];

  const html = document.getElementById("node-html");
  const src = document.getElementById("node-src");
  const alt = document.getElementById("node-alt");
  const href = document.getElementById("node-href");
  const align = document.getElementById("node-align");
  const className = document.getElementById("node-class");
  const idInput = document.getElementById("node-id");
  const hidden = document.getElementById("node-hidden");

  if (html) {
    edit.html = html.value;
    node.innerHTML = html.value;
  }
  if (src && node.tagName === "IMG") {
    edit.src = src.value;
    node.setAttribute("src", src.value);
  }
  if (alt && node.tagName === "IMG") {
    edit.alt = alt.value;
    node.setAttribute("alt", alt.value);
  }
  if (href && node.tagName === "A") {
    edit.href = href.value;
    node.setAttribute("href", href.value);
  }
  if (align) {
    edit.align = align.value;
    node.style.textAlign = align.value;
  }
  if (className) {
    edit.className = className.value;
    node.className = className.value;
  }
  if (idInput) {
    edit.id = idInput.value;
    node.id = idInput.value;
  }
  if (hidden) {
    edit.hidden = hidden.checked;
    node.style.display = hidden.checked ? "none" : "";
  }

  markDirty();
  renderStructure();
  showToast("Elemento actualizado.");
}

function renderStructure() {
  const doc = siteFrame.contentDocument;
  if (!doc) return;
  structureTree.innerHTML = "";

  const nodes = [...doc.querySelectorAll("header,main,main > section,footer,.vj-custom-block")];
  nodes.forEach((node) => {
    if (!node || !node.tagName) return;

    const item = document.createElement("div");
    item.className = "tree-item";

    const selector = node.dataset.vjCustomId ? `custom:${node.dataset.vjCustomId}` : getSelectorPath(node);
    const isActive = selectedTarget && ((selectedTarget.kind === "custom" && selector === `custom:${selectedTarget.id}`) || (selectedTarget.kind === "node" && selectedTarget.selector === selector));
    if (isActive) item.classList.add("active");

    const label = node.dataset.vjCustomId
      ? `🧩 ${prettyName(node.dataset.vjCustomType || "bloque")}`
      : `${iconForTag(node.tagName)} ${shortText(node.textContent || node.tagName.toLowerCase())}`;

    const left = document.createElement("button");
    left.type = "button";
    left.textContent = label;
    left.style.textAlign = "left";
    left.style.flex = "1";
    left.addEventListener("click", () => {
      onNodeSelected(node);
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const toggle = document.createElement("button");
    toggle.type = "button";
    const hidden = isNodeHidden(selector);
    toggle.textContent = hidden ? "Mostrar" : "Ocultar";
    toggle.addEventListener("click", () => toggleNodeVisibility(node, selector, hidden));

    item.append(left, toggle);
    structureTree.appendChild(item);
  });
}

function isNodeHidden(selector) {
  const page = getCurrentPageData();
  if (selector.startsWith("custom:")) {
    const id = selector.replace("custom:", "");
    const block = page.customBlocks.find((item) => item.id === id);
    return block ? block.visible === false : false;
  }

  return Boolean(page.nodes[selector]?.hidden);
}

function toggleNodeVisibility(node, selector, currentlyHidden) {
  pushHistory();
  const page = getCurrentPageData();

  if (selector.startsWith("custom:")) {
    const id = selector.replace("custom:", "");
    const block = page.customBlocks.find((item) => item.id === id);
    if (block) block.visible = currentlyHidden;
    markDirty();
    loadFrame();
    return;
  }

  page.nodes[selector] ||= {};
  page.nodes[selector].hidden = !currentlyHidden;
  node.style.display = currentlyHidden ? "" : "none";
  markDirty();
  renderStructure();
}

function addBlock(type) {
  const page = getCurrentPageData();
  const anchor = selectedTarget?.kind === "node" ? selectedTarget.selector : "main";
  const block = defaultBlock(type, anchor);
  pushHistory();
  page.customBlocks.push(block);
  markDirty();
  loadFrame();
  showToast(`${prettyName(type)} añadido.`);
}

function defaultBlock(type, anchor) {
  const base = {
    id: uid("block"),
    type,
    anchor,
    visible: true,
    styles: { align: "left", size: "medium" },
    advanced: { id: "", className: "" },
    data: {},
  };

  if (type === "texto") base.data = { content: "Escribe aqui tu texto..." };
  if (type === "imagen") base.data = { image: "https://via.placeholder.com/900x400?text=Imagen", alt: "Imagen" };
  if (type === "lista") base.data = { title: "Lista", items: "Primer punto\nSegundo punto\nTercer punto" };
  if (type === "linea") base.data = { style: "solid" };
  if (type === "enlace") base.data = { label: "Boton", url: "https://" };
  if (type === "video") base.data = { title: "Video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" };

  if (type === "noticia") {
    base.data = {
      image: "https://via.placeholder.com/1000x420?text=Noticia",
      title: "Titulo de la noticia",
      date: toDateInput(new Date()),
      content: "Texto de la noticia...",
      link: "#",
    };
  }

  if (type === "evento") {
    base.data = {
      title: "Nombre del evento",
      startDate: toDateInput(new Date()),
      endDate: toDateInput(new Date()),
      time: "20:00",
      location: "Lugar",
      description: "Descripcion del evento",
      buttonLabel: "Añadir al calendario",
    };
  }

  if (type === "miembro") {
    base.data = {
      image: "https://via.placeholder.com/200x200?text=Foto",
      name: "Nombre Apellido",
      role: "Cargo",
      email: "correo@ejemplo.com",
      phone: "600 000 000",
      bio: "Biografia opcional",
    };
  }

  if (type === "galeria") {
    base.data = {
      title: "Galeria de imagenes",
      columns: "3",
      images: [
        "https://via.placeholder.com/500x350?text=Foto+1",
        "https://via.placeholder.com/500x350?text=Foto+2",
        "https://via.placeholder.com/500x350?text=Foto+3",
      ],
    };
  }

  return base;
}
function applyPageDataToDoc(doc, pageKey) {
  const page = getPageData(pageKey);

  Object.entries(page.nodes).forEach(([selector, edit]) => {
    const node = doc.querySelector(selector);
    if (!node) return;

    if (typeof edit.html === "string") node.innerHTML = edit.html;
    if (typeof edit.src === "string") node.setAttribute("src", edit.src);
    if (typeof edit.alt === "string") node.setAttribute("alt", edit.alt);
    if (typeof edit.href === "string" && node.tagName === "A") node.setAttribute("href", edit.href);
    if (typeof edit.align === "string") node.style.textAlign = edit.align;
    if (typeof edit.className === "string") node.className = edit.className;
    if (typeof edit.id === "string") node.id = edit.id;
    if (typeof edit.backgroundImage === "string" && edit.backgroundImage) node.style.backgroundImage = `url('${edit.backgroundImage}')`;
    if (edit.hidden) node.style.display = "none";
  });

  doc.querySelectorAll(".vj-custom-block").forEach((node) => node.remove());

  page.customBlocks.forEach((block) => {
    if (block.visible === false) return;
    const element = renderCustomBlock(doc, block);
    const anchor = doc.querySelector(block.anchor || "main");
    if (!anchor) {
      doc.body.appendChild(element);
      return;
    }
    if (anchor.parentElement) anchor.insertAdjacentElement("afterend", element);
    else doc.body.appendChild(element);
  });

  mountCustomToolbars(doc);
}

function renderCustomBlock(doc, block) {
  const wrap = doc.createElement("section");
  wrap.className = "vj-custom-block";
  wrap.dataset.vjCustomId = block.id;
  wrap.dataset.vjCustomType = block.type;

  if (block.advanced?.id) wrap.id = block.advanced.id;
  if (block.advanced?.className) wrap.classList.add(...block.advanced.className.split(" ").filter(Boolean));
  wrap.style.textAlign = block.styles?.align || "left";

  const data = block.data || {};

  if (block.type === "texto") wrap.innerHTML = `<p>${data.content || ""}</p>`;
  if (block.type === "imagen") wrap.innerHTML = `<img src="${escapeAttr(data.image || "")}" alt="${escapeAttr(data.alt || "")}" />`;
  if (block.type === "lista") {
    const items = String(data.items || "").split("\n").filter(Boolean).map((item) => `<li>${item}</li>`).join("");
    wrap.innerHTML = `<h3>${data.title || ""}</h3><ul>${items}</ul>`;
  }
  if (block.type === "linea") wrap.innerHTML = `<hr style="border:0;border-top:2px ${data.style || "solid"} #d0d6dd;" />`;
  if (block.type === "enlace") wrap.innerHTML = `<a href="${escapeAttr(data.url || "#")}" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#2196f3;color:#fff;text-decoration:none;">${data.label || "Boton"}</a>`;
  if (block.type === "video") wrap.innerHTML = `<h3>${data.title || "Video"}</h3><iframe src="${escapeAttr(data.url || "")}" width="100%" height="320" style="border:0;border-radius:8px;" allowfullscreen></iframe>`;

  if (block.type === "noticia") {
    wrap.classList.add("vj-news");
    wrap.innerHTML = `
      <img src="${escapeAttr(data.image || "")}" alt="Noticia" />
      <h2>${data.title || ""}</h2>
      <p>📅 ${formatDisplayDate(data.date)}</p>
      <div>${data.content || ""}</div>
      <p><a href="${escapeAttr(data.link || "#")}">Leer mas →</a></p>
    `;
  }

  if (block.type === "evento") {
    wrap.classList.add("vj-event");
    wrap.innerHTML = `
      <h2>📅 ${data.title || ""}</h2>
      <p>🗓️ ${formatDisplayDate(data.startDate)} - ${formatDisplayDate(data.endDate)}</p>
      <p>📍 ${data.location || ""}</p>
      <p>🕐 ${data.time || ""}</p>
      <div>${data.description || ""}</div>
      <button type="button" style="margin-top:8px;border:1px solid #90caf9;background:#e3f2fd;border-radius:6px;padding:8px 12px;cursor:pointer;">${data.buttonLabel || "Añadir al calendario"}</button>
    `;
  }

  if (block.type === "miembro") {
    wrap.innerHTML = `
      <div class="vj-member">
        <img src="${escapeAttr(data.image || "")}" alt="${escapeAttr(data.name || "")}" />
        <div>
          <h3>${data.name || ""}</h3>
          <p>${data.role || ""}</p>
          <p>📧 <a href="mailto:${escapeAttr(data.email || "")}">${data.email || ""}</a></p>
          <p>📱 <a href="tel:${escapeAttr(String(data.phone || "").replace(/\s+/g, ""))}">${data.phone || ""}</a></p>
          <p>${data.bio || ""}</p>
        </div>
      </div>
    `;
  }

  if (block.type === "galeria") {
    const columns = Number(data.columns || 3);
    const images = Array.isArray(data.images) ? data.images : [];
    const items = images.map((src) => `<img src="${escapeAttr(src)}" alt="Galeria" />`).join("");
    wrap.innerHTML = `
      <h3>${data.title || "Galeria"}</h3>
      <div class="vj-gallery-grid" style="grid-template-columns:repeat(${Math.max(2, Math.min(4, columns))},minmax(0,1fr));">${items}</div>
    `;
  }

  return wrap;
}

function getPageData(pageKey) {
  store.pages[pageKey] ||= { nodes: {}, customBlocks: [], versions: [], pageSettings: {} };
  return store.pages[pageKey];
}

function getCurrentPageData() {
  return getPageData(currentPageKey);
}

function markDirty() {
  dirty = true;
  saveState.textContent = "⏳ Cambios sin guardar";
}

function saveNow(withToast = false) {
  if (!dirty && !withToast) return;

  const page = getCurrentPageData();
  page.versions ||= [];
  page.versions.unshift({
    savedAt: new Date().toISOString(),
    user: currentAccount?.user || "",
    snapshot: cloneData({ nodes: page.nodes, customBlocks: page.customBlocks }),
  });
  page.versions = page.versions.slice(0, 10);

  saveStore();
  dirty = false;
  lastSavedAt = Date.now();
  saveState.textContent = `💾 Guardado ${new Date(lastSavedAt).toLocaleTimeString("es-ES")}`;
  if (withToast) showToast("Cambios guardados.");
}

function startAutosave() {
  stopAutosave();
  autosaveTimer = setInterval(() => {
    if (!dirty) {
      const seconds = Math.max(1, Math.floor((Date.now() - lastSavedAt) / 1000));
      saveState.textContent = `💾 Guardado hace ${seconds}s`;
      return;
    }
    saveState.textContent = "⏳ Guardando...";
    saveNow(false);
  }, 30000);
}

function stopAutosave() {
  if (autosaveTimer) clearInterval(autosaveTimer);
  autosaveTimer = null;
}

function pushHistory() {
  const page = getCurrentPageData();
  historyByPage[currentPageKey] ||= { undo: [], redo: [] };
  const stack = historyByPage[currentPageKey];
  stack.undo.push(cloneData({ nodes: page.nodes, customBlocks: page.customBlocks }));
  if (stack.undo.length > 40) stack.undo.shift();
  stack.redo = [];
}

function undo() {
  const history = historyByPage[currentPageKey];
  if (!history || history.undo.length === 0) return;

  const page = getCurrentPageData();
  history.redo.push(cloneData({ nodes: page.nodes, customBlocks: page.customBlocks }));
  const previous = history.undo.pop();
  page.nodes = cloneData(previous.nodes || {});
  page.customBlocks = cloneData(previous.customBlocks || []);
  markDirty();
  loadFrame();
}

function redo() {
  const history = historyByPage[currentPageKey];
  if (!history || history.redo.length === 0) return;

  const page = getCurrentPageData();
  history.undo.push(cloneData({ nodes: page.nodes, customBlocks: page.customBlocks }));
  const next = history.redo.pop();
  page.nodes = cloneData(next.nodes || {});
  page.customBlocks = cloneData(next.customBlocks || []);
  markDirty();
  loadFrame();
}

function copyBlock() {
  if (!selectedTarget) return;

  if (selectedTarget.kind === "custom") {
    const block = getCurrentPageData().customBlocks.find((item) => item.id === selectedTarget.id);
    if (!block) return;
    clipboardBlock = { type: "custom", data: cloneData(block) };
    showToast("Bloque copiado.");
    return;
  }

  clipboardBlock = { type: "html", html: selectedTarget.element.outerHTML, anchor: selectedTarget.selector };
  showToast("Elemento copiado.");
}

function pasteBlock() {
  if (!clipboardBlock) return;
  pushHistory();

  if (clipboardBlock.type === "custom") {
    const clone = cloneData(clipboardBlock.data);
    clone.id = uid("block");
    getCurrentPageData().customBlocks.push(clone);
    markDirty();
    loadFrame();
    return;
  }

  const block = defaultBlock("texto", selectedTarget?.selector || "main");
  block.data.content = clipboardBlock.html;
  getCurrentPageData().customBlocks.push(block);
  markDirty();
  loadFrame();
}

function duplicateSelected() {
  copyBlock();
  pasteBlock();
}

function removeSelected() {
  if (!selectedTarget) return;
  const ok = confirm("¿Eliminar el bloque seleccionado?");
  if (!ok) return;

  pushHistory();

  if (selectedTarget.kind === "custom") {
    const page = getCurrentPageData();
    page.customBlocks = page.customBlocks.filter((item) => item.id !== selectedTarget.id);
    selectedTarget = null;
    markDirty();
    loadFrame();
    return;
  }

  const page = getCurrentPageData();
  page.nodes[selectedTarget.selector] ||= {};
  page.nodes[selectedTarget.selector].hidden = true;
  selectedTarget.element.style.display = "none";
  selectedTarget = null;
  markDirty();
  renderStructure();
}

function handleShortcuts(event) {
  if (editorView.classList.contains("hidden")) return;
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const mod = isMac ? event.metaKey : event.ctrlKey;

  if (mod && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveNow(true);
  }

  if (mod && !event.shiftKey && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
  }

  if ((mod && event.shiftKey && event.key.toLowerCase() === "z") || (mod && event.key.toLowerCase() === "y")) {
    event.preventDefault();
    redo();
  }

  if (mod && event.key.toLowerCase() === "c") {
    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
    event.preventDefault();
    copyBlock();
  }

  if (mod && event.key.toLowerCase() === "v") {
    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
    event.preventDefault();
    pasteBlock();
  }

  if (mod && event.key.toLowerCase() === "d") {
    event.preventDefault();
    duplicateSelected();
  }

  if (mod && event.key.toLowerCase() === "k") {
    event.preventDefault();
    setActiveTab("blocks");
    blockSearch.focus();
  }

  if ((event.key === "Delete" || event.key === "Backspace") && selectedTarget) {
    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
    event.preventDefault();
    removeSelected();
  }

  if (event.key === "Escape") {
    cancelInlineEdit();
    closeAllModals();
  }
}

function openPreview() {
  const page = getCurrentPageMeta();
  previewFrame.src = `${page.url}?preview=${Date.now()}`;
  previewModal.classList.remove("hidden");
}

function openPageSettings() {
  const page = getCurrentPageMeta();
  const pageData = getCurrentPageData();
  const settings = pageData.pageSettings || {};

  pageTitleInput.value = settings.title || page.label;
  pageSlugInput.value = settings.slug || slugFrom(page.label);
  pageMetaInput.value = settings.metaDescription || "";
  renderAdminManagerInPageSettings();
  pageSettingsModal.classList.remove("hidden");
}

function savePageSettings() {
  const pageData = getCurrentPageData();
  pageData.pageSettings ||= {};
  pageData.pageSettings.title = pageTitleInput.value.trim();
  pageData.pageSettings.slug = pageSlugInput.value.trim();
  pageData.pageSettings.metaDescription = pageMetaInput.value.trim();

  const pageMeta = getCurrentPageMeta();
  pageMeta.label = pageTitleInput.value.trim() || pageMeta.label;

  if (currentAccount?.role === "superadmin") {
    const toggles = pageSettingsModal.querySelectorAll("[data-admin-user]");
    toggles.forEach((toggle) => {
      adminStatus[toggle.dataset.adminUser] = toggle.checked;
    });
    saveAdminStatus();
  }

  renderPagesPicker();
  renderPagesTab();
  markDirty();
  saveNow(false);
  pageSettingsModal.classList.add("hidden");
  showToast("Configuracion guardada.");
}

function renderAdminManagerInPageSettings() {
  const existing = pageSettingsModal.querySelector(".admin-manage");
  if (existing) existing.remove();
  if (currentAccount?.role !== "superadmin") return;

  const box = document.createElement("div");
  box.className = "admin-manage";
  box.style.padding = "0 12px 12px";
  box.innerHTML = "<h4>Usuarios administradores</h4>";

  ACCOUNTS.filter((account) => account.role === "admin").forEach((account) => {
    const row = document.createElement("label");
    row.style.display = "block";
    row.style.fontSize = "13px";
    row.style.marginBottom = "6px";
    const checked = adminStatus[account.user] !== false;
    row.innerHTML = `<input data-admin-user="${account.user}" type="checkbox" ${checked ? "checked" : ""}/> ${account.user}`;
    box.appendChild(row);
  });

  pageSettingsModal.querySelector(".modal-card").insertBefore(box, pageSettingsModal.querySelector("footer"));
}
function createNewDraftPage() {
  const name = prompt("Nombre de la nueva pagina");
  if (!name) return;

  const key = `draft-${slugFrom(name)}-${Date.now()}`;
  const current = getCurrentPageMeta();

  store.pagesMeta.push({ key, label: name, url: current.url, status: "borrador" });
  store.pages[key] = cloneData(getCurrentPageData());
  currentPageKey = key;
  renderPagesPicker();
  renderPagesTab();
  loadFrame();
  markDirty();
}

function duplicatePage(key) {
  const sourceMeta = getPagesMeta().find((page) => page.key === key);
  if (!sourceMeta) return;

  const name = prompt("Nombre de la copia", `${sourceMeta.label} copia`);
  if (!name) return;

  const newKey = `draft-${slugFrom(name)}-${Date.now()}`;
  store.pagesMeta.push({ key: newKey, label: name, url: sourceMeta.url, status: "borrador" });
  store.pages[newKey] = cloneData(getPageData(key));
  saveStore();
  renderPagesPicker();
  renderPagesTab();
}

function removePage(key) {
  const pageMeta = getPagesMeta().find((page) => page.key === key);
  if (!pageMeta || pageMeta.status === "publicada") {
    showToast("Solo se pueden eliminar borradores.");
    return;
  }

  const ok = confirm(`¿Eliminar la pagina "${pageMeta.label}"?`);
  if (!ok) return;

  store.pagesMeta = store.pagesMeta.filter((page) => page.key !== key);
  delete store.pages[key];
  if (currentPageKey === key) currentPageKey = store.pagesMeta[0]?.key || "main/index.html";

  renderPagesPicker();
  renderPagesTab();
  loadFrame();
  markDirty();
}

function openImageModal(target) {
  pendingImageTarget = target;
  selectedImageId = null;
  uploadPreview.innerHTML = "";
  renderImageLibrary();
  imageModal.classList.remove("hidden");
}

function handleFiles(fileList) {
  const files = [...fileList];
  const accepted = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  files.forEach((file) => {
    if (!accepted.includes(file.type)) {
      showToast(`Formato no permitido: ${file.name}`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(`Archivo demasiado grande: ${file.name}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const id = uid("img");
      const item = {
        id,
        name: file.name,
        dataUrl: reader.result,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      store.uploads.unshift(item);
      saveStore();
      selectedImageId = id;
      renderUploadPreview(item);
      renderImageLibrary();
      markDirty();
    };
    reader.readAsDataURL(file);
  });
}

function renderUploadPreview(image) {
  uploadPreview.innerHTML = "";
  const card = document.createElement("div");
  card.className = "image-thumb selected";
  card.innerHTML = `<img src="${image.dataUrl}" alt="${image.name}" /><p>${image.name}</p>`;
  uploadPreview.appendChild(card);
}

function renderImageLibrary() {
  const query = imageSearch.value.trim().toLowerCase();
  imageLibraryGrid.innerHTML = "";

  store.uploads
    .filter((image) => image.name.toLowerCase().includes(query))
    .forEach((image) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `image-thumb ${selectedImageId === image.id ? "selected" : ""}`;
      card.innerHTML = `<img src="${image.dataUrl}" alt="${image.name}" /><p>${image.name}</p>`;
      card.addEventListener("click", () => {
        selectedImageId = image.id;
        renderImageLibrary();
      });
      imageLibraryGrid.appendChild(card);
    });
}

function applySelectedImage() {
  if (!pendingImageTarget || !selectedImageId) {
    showToast("Selecciona una imagen.");
    return;
  }

  const image = store.uploads.find((item) => item.id === selectedImageId);
  if (!image) return;
  pushHistory();

  if (pendingImageTarget.type === "node-image") {
    const selector = pendingImageTarget.selector;
    const page = getCurrentPageData();
    page.nodes[selector] ||= {};
    page.nodes[selector].src = image.dataUrl;
    markDirty();
    loadFrame();
  }

  if (pendingImageTarget.type === "custom-image") {
    const block = getCurrentPageData().customBlocks.find((item) => item.id === pendingImageTarget.id);
    if (block) {
      if (block.type === "miembro" || block.type === "noticia" || block.type === "imagen") block.data.image = image.dataUrl;
      markDirty();
      loadFrame();
    }
  }

  if (pendingImageTarget.type === "custom-gallery") {
    const block = getCurrentPageData().customBlocks.find((item) => item.id === pendingImageTarget.id);
    if (block && block.type === "galeria") {
      block.data.images ||= [];
      block.data.images.push(image.dataUrl);
      markDirty();
      loadFrame();
    }
  }

  imageModal.classList.add("hidden");
}

function migrateLegacyEdits() {
  if (!localStorage.getItem(LEGACY_EDITS_KEY)) return;
  if (store.migratedLegacy) return;

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_EDITS_KEY));
    if (!legacy?.pages) return;

    Object.entries(legacy.pages).forEach(([pageKey, edits]) => {
      const page = getPageData(pageKey);
      Object.entries(edits).forEach(([selector, edit]) => {
        page.nodes[selector] ||= {};
        if (edit.type === "text") {
          page.nodes[selector].html = typeof edit.text === "string" ? edit.text : "";
          if (typeof edit.href === "string") page.nodes[selector].href = edit.href;
        }
        if (edit.type === "image") {
          page.nodes[selector].src = edit.src || "";
          page.nodes[selector].alt = edit.alt || "";
        }
        if (edit.type === "background-image") page.nodes[selector].backgroundImage = edit.url || "";
      });
    });

    store.migratedLegacy = true;
    saveStore();
  } catch (_error) {
    // ignore
  }
}

function loadStore() {
  try {
    const raw = localStorage.getItem(EDITOR_STORE_KEY);
    if (!raw) return { version: 3, pages: {}, pagesMeta: cloneData(BASE_PAGES), uploads: [] };
    const parsed = JSON.parse(raw);
    return {
      version: 3,
      pages: parsed.pages || {},
      pagesMeta: parsed.pagesMeta || cloneData(BASE_PAGES),
      uploads: parsed.uploads || [],
      migratedLegacy: Boolean(parsed.migratedLegacy),
    };
  } catch (_error) {
    return { version: 3, pages: {}, pagesMeta: cloneData(BASE_PAGES), uploads: [] };
  }
}

function saveStore() {
  localStorage.setItem(EDITOR_STORE_KEY, JSON.stringify(store));
}

function loadAdminStatus() {
  const defaults = {};
  ACCOUNTS.filter((account) => account.role === "admin").forEach((account) => {
    defaults[account.user] = true;
  });

  try {
    const raw = localStorage.getItem(ADMIN_STATUS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (_error) {
    return defaults;
  }
}

function saveAdminStatus() {
  localStorage.setItem(ADMIN_STATUS_KEY, JSON.stringify(adminStatus));
}

function findAccount(inputUser, inputPwd) {
  const normalized = normalizeUser(inputUser);
  return ACCOUNTS.find((account) => normalizeUser(account.user) === normalized && account.pwd === inputPwd);
}

function normalizeUser(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function section(title) {
  const wrap = document.createElement("section");
  wrap.className = "config-section";
  wrap.innerHTML = `<h4>${title}</h4>`;
  return wrap;
}

function inputField(label, id, value, multiline = false) {
  const wrap = document.createElement("label");
  wrap.textContent = label;

  if (multiline) {
    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.value = value || "";
    wrap.appendChild(textarea);
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.value = value || "";
    wrap.appendChild(input);
  }

  return wrap;
}

function selectField(label, id, value, options) {
  const wrap = document.createElement("label");
  wrap.textContent = label;
  const select = document.createElement("select");
  select.id = id;
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option;
    item.textContent = option;
    select.appendChild(item);
  });
  select.value = value;
  wrap.appendChild(select);
  return wrap;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function getSelectorPath(node) {
  const parts = [];
  let cursor = node;

  while (cursor && cursor.nodeType === 1) {
    const tag = cursor.tagName.toLowerCase();
    if (tag === "html") break;
    const parent = cursor.parentElement;
    if (!parent) break;
    const index = [...parent.children].indexOf(cursor) + 1;
    parts.unshift(`${tag}:nth-child(${index})`);
    if (tag === "body") break;
    cursor = parent;
  }

  return parts.join(" > ");
}

function isInlineTextNode(node) {
  return ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "A", "LI", "STRONG", "EM", "SMALL", "LABEL", "BUTTON", "DIV"].includes(node.tagName);
}

function prettyName(value) {
  return String(value || "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortText(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "Bloque";
  return clean.slice(0, 28) + (clean.length > 28 ? "..." : "");
}

function iconForTag(tagName) {
  const tag = String(tagName || "").toLowerCase();
  if (tag === "header") return "🏠";
  if (tag === "main") return "📄";
  if (tag === "section") return "🧱";
  if (tag === "footer") return "🔻";
  if (tag === "article") return "📰";
  return "•";
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugFrom(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-ES");
}

function closeAllModals() {
  [imageModal, previewModal, pageSettingsModal].forEach((modal) => modal.classList.add("hidden"));
}

function escapeAttr(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

