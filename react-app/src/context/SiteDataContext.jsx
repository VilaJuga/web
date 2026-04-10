import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const SiteDataContext = createContext(null);

const SITE_COLLECTION = "site";
const CONTENT_DOC = "content";
const IMAGES_DOC = "images";

function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") {
    // Recover arrays that got converted to maps (e.g. {0: "a", 1: "b"})
    const keys = Object.keys(val).filter((k) => /^\d+$/.test(k)).sort((a, b) => +a - +b);
    if (keys.length) return keys.map((k) => val[k]);
  }
  return [];
}

function buildSiteData(content, images) {
  return {
    ...content,
    heroSlides: ensureArray(images.hero),
    introGallery: ensureArray(images.introGallery),
    cards: (content.cards || []).map((card, i) => ({
      ...card,
      image: images.cards?.[i]?.src ?? "",
      alt: images.cards?.[i]?.alt ?? "",
    })),
    visit: {
      ...(content.visit || {}),
      backgroundImage: images.visit?.src ?? "",
    },
    activitats: {
      ...(content.activitats || {}),
      torneigs: (content.activitats?.torneigs || []).map((t, i) => ({
        ...t,
        image: images.activitats?.torneigs?.[i] || { src: "", alt: "" },
      })),
    },
    about: {
      ...(content.about || {}),
      image: images.about?.logo || { src: "", alt: "" },
    },
  };
}

/** Deep merge that only fills missing fields (does NOT overwrite existing values). */
function fillMissing(target, source) {
  if (!source || typeof source !== "object") return target;
  if (target === undefined || target === null) return source;
  if (Array.isArray(target)) return target; // don't auto-extend arrays

  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (out[key] === undefined) {
      out[key] = source[key];
    } else if (
      typeof out[key] === "object" &&
      !Array.isArray(out[key]) &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      out[key] = fillMissing(out[key], source[key]);
    }
  }
  return out;
}

async function seedIfEmpty() {
  const contentRef = doc(db, SITE_COLLECTION, CONTENT_DOC);
  const imagesRef = doc(db, SITE_COLLECTION, IMAGES_DOC);
  const [contentSnap, imagesSnap, contentSeed, imagesSeed] = await Promise.all([
    getDoc(contentRef),
    getDoc(imagesRef),
    fetch("/data/content.json").then((r) => r.json()),
    fetch("/data/images.json").then((r) => r.json()),
  ]);

  const tasks = [];
  if (!contentSnap.exists()) {
    tasks.push(setDoc(contentRef, contentSeed));
  } else {
    // Fill in any new fields added to the seed (e.g. contacte.form, contacte.adminEmail)
    const merged = fillMissing(contentSnap.data(), contentSeed);
    if (JSON.stringify(merged) !== JSON.stringify(contentSnap.data())) {
      tasks.push(setDoc(contentRef, merged));
    }
  }
  if (!imagesSnap.exists()) {
    tasks.push(setDoc(imagesRef, imagesSeed));
  } else {
    const merged = fillMissing(imagesSnap.data(), imagesSeed);
    if (JSON.stringify(merged) !== JSON.stringify(imagesSnap.data())) {
      tasks.push(setDoc(imagesRef, merged));
    }
  }
  await Promise.all(tasks);
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/** Immutable set by dot-path. Preserves arrays as arrays, objects as objects. */
function setByPath(source, path, value) {
  const keys = path.split(".");
  const clone = JSON.parse(JSON.stringify(source ?? {}));
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    if (current[key] == null) {
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

export function SiteDataProvider({ children }) {
  const [rawContent, setRawContent] = useState(null);
  const [rawImages, setRawImages] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubContent, unsubImages;

    async function init() {
      try {
        await seedIfEmpty();

        unsubContent = onSnapshot(
          doc(db, SITE_COLLECTION, CONTENT_DOC),
          (snap) => setRawContent(snap.data() || {}),
          (err) => setError(err.message)
        );
        unsubImages = onSnapshot(
          doc(db, SITE_COLLECTION, IMAGES_DOC),
          (snap) => setRawImages(snap.data() || {}),
          (err) => setError(err.message)
        );
      } catch (err) {
        console.error("Error initializing site data:", err);
        setError(err.message);
      }
    }

    init();

    return () => {
      unsubContent?.();
      unsubImages?.();
    };
  }, []);

  useEffect(() => {
    if (rawContent && rawImages) {
      setData(buildSiteData(rawContent, rawImages));
    }
  }, [rawContent, rawImages]);

  async function saveField(type, path, value) {
    try {
      const docId = type === "content" ? CONTENT_DOC : IMAGES_DOC;
      const ref = doc(db, SITE_COLLECTION, docId);
      const source = type === "content" ? rawContent : rawImages;

      // If path targets a nested element inside an array (e.g. "hero.0" or "cards.0.src"),
      // Firestore dot-path notation would turn the array into a map. To avoid this,
      // we rebuild the top-level field locally and write it as a whole.
      const keys = path.split(".");
      if (keys.length === 1) {
        await updateDoc(ref, { [path]: value });
        return;
      }

      const updated = setByPath(source, path, value);
      const topKey = keys[0];
      await updateDoc(ref, { [topKey]: updated[topKey] });
    } catch (err) {
      console.error("Error saving field:", err);
      alert("Error guardant: " + err.message);
    }
  }

  async function addArrayItem(type, arrayPath, newItem) {
    try {
      const docId = type === "content" ? CONTENT_DOC : IMAGES_DOC;
      const source = type === "content" ? rawContent : rawImages;
      const current = getByPath(source, arrayPath) || [];
      const newArray = [...current, newItem];
      await updateDoc(doc(db, SITE_COLLECTION, docId), { [arrayPath]: newArray });
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Error afegint: " + err.message);
    }
  }

  async function reorderArrayItem(type, arrayPath, fromIndex, toIndex) {
    try {
      if (fromIndex === toIndex) return;
      const docId = type === "content" ? CONTENT_DOC : IMAGES_DOC;
      const source = type === "content" ? rawContent : rawImages;
      const current = getByPath(source, arrayPath) || [];
      if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return;
      const newArray = [...current];
      const [moved] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, moved);
      await updateDoc(doc(db, SITE_COLLECTION, docId), { [arrayPath]: newArray });
    } catch (err) {
      console.error("Error reordering item:", err);
      alert("Error reordenant: " + err.message);
    }
  }

  async function removeArrayItem(type, arrayPath, index) {
    try {
      const docId = type === "content" ? CONTENT_DOC : IMAGES_DOC;
      const source = type === "content" ? rawContent : rawImages;
      const current = getByPath(source, arrayPath) || [];
      const newArray = current.filter((_, i) => i !== index);
      await updateDoc(doc(db, SITE_COLLECTION, docId), { [arrayPath]: newArray });
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Error eliminant: " + err.message);
    }
  }

  /** Adds a card (both content.cards and images.cards in parallel) */
  async function addCard() {
    try {
      const newContentCards = [
        ...(rawContent.cards || []),
        { title: "Nova targeta", text: "Descripció de la targeta..." },
      ];
      const newImagesCards = [
        ...(rawImages.cards || []),
        { src: "", alt: "Nova imatge" },
      ];
      await Promise.all([
        updateDoc(doc(db, SITE_COLLECTION, CONTENT_DOC), { cards: newContentCards }),
        updateDoc(doc(db, SITE_COLLECTION, IMAGES_DOC), { cards: newImagesCards }),
      ]);
    } catch (err) {
      alert("Error afegint targeta: " + err.message);
    }
  }

  async function removeCard(index) {
    try {
      const newContentCards = (rawContent.cards || []).filter((_, i) => i !== index);
      const newImagesCards = (rawImages.cards || []).filter((_, i) => i !== index);
      await Promise.all([
        updateDoc(doc(db, SITE_COLLECTION, CONTENT_DOC), { cards: newContentCards }),
        updateDoc(doc(db, SITE_COLLECTION, IMAGES_DOC), { cards: newImagesCards }),
      ]);
    } catch (err) {
      alert("Error eliminant targeta: " + err.message);
    }
  }

  /** Adds a torneig (both content.activitats.torneigs and images.activitats.torneigs in parallel) */
  async function addTorneig() {
    try {
      const newContentTorneigs = [
        ...(rawContent.activitats?.torneigs || []),
        {
          title: "Nou torneig",
          data: "",
          horari: "",
          ubicacio: "",
          notes: [],
          inscripcioUrl: "",
          inscripcioText: "Inscripció",
        },
      ];
      const newImagesTorneigs = [
        ...(rawImages.activitats?.torneigs || []),
        { src: "", alt: "Nou torneig" },
      ];
      await Promise.all([
        updateDoc(doc(db, SITE_COLLECTION, CONTENT_DOC), {
          "activitats.torneigs": newContentTorneigs,
        }),
        updateDoc(doc(db, SITE_COLLECTION, IMAGES_DOC), {
          "activitats.torneigs": newImagesTorneigs,
        }),
      ]);
    } catch (err) {
      alert("Error afegint torneig: " + err.message);
    }
  }

  async function removeTorneig(index) {
    try {
      const newContentTorneigs = (rawContent.activitats?.torneigs || []).filter((_, i) => i !== index);
      const newImagesTorneigs = (rawImages.activitats?.torneigs || []).filter((_, i) => i !== index);
      await Promise.all([
        updateDoc(doc(db, SITE_COLLECTION, CONTENT_DOC), {
          "activitats.torneigs": newContentTorneigs,
        }),
        updateDoc(doc(db, SITE_COLLECTION, IMAGES_DOC), {
          "activitats.torneigs": newImagesTorneigs,
        }),
      ]);
    } catch (err) {
      alert("Error eliminant torneig: " + err.message);
    }
  }

  /** Restores a single top-level field from the seed JSON (content or images). */
  async function restoreFromSeed(type, topKey) {
    try {
      const seedFile = type === "content" ? "/data/content.json" : "/data/images.json";
      const docId = type === "content" ? CONTENT_DOC : IMAGES_DOC;
      const seed = await fetch(seedFile).then((r) => r.json());
      if (seed[topKey] === undefined) {
        alert("No s'ha trobat " + topKey + " al seed.");
        return;
      }
      await updateDoc(doc(db, SITE_COLLECTION, docId), { [topKey]: seed[topKey] });
    } catch (err) {
      alert("Error restaurant: " + err.message);
    }
  }

  async function resetToDefaults() {
    try {
      const [contentJson, imagesJson] = await Promise.all([
        fetch("/data/content.json").then((r) => r.json()),
        fetch("/data/images.json").then((r) => r.json()),
      ]);
      await Promise.all([
        setDoc(doc(db, SITE_COLLECTION, CONTENT_DOC), contentJson),
        setDoc(doc(db, SITE_COLLECTION, IMAGES_DOC), imagesJson),
      ]);
    } catch (err) {
      alert("Error restablint: " + err.message);
    }
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: "2rem" }}>
        <div>
          <h2>Error connectant a la base de dades</h2>
          <p>{error}</p>
          <p style={{ fontSize: "0.9rem", color: "#888" }}>
            Assegura't que els emuladors de Firebase estan corrent (npm run emulators).
          </p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Carregant...</div>;
  }

  return (
    <SiteDataContext.Provider
      value={{
        data,
        saveField,
        addArrayItem,
        removeArrayItem,
        reorderArrayItem,
        addCard,
        removeCard,
        addTorneig,
        removeTorneig,
        restoreFromSeed,
        resetToDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
