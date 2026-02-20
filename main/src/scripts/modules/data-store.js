import { cloneDefaultSiteData } from "../../data/content.js";

export const STORAGE_KEY = "vilajuga_site_data_v1";

export function getSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultSiteData();
    const parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed, cloneDefaultSiteData());
  } catch (_err) {
    return cloneDefaultSiteData();
  }
}

export function saveSiteData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetSiteData() {
  const defaults = cloneDefaultSiteData();
  saveSiteData(defaults);
  return defaults;
}

function mergeWithDefaults(source, defaults) {
  if (Array.isArray(defaults)) {
    return Array.isArray(source) ? source : defaults;
  }

  if (defaults && typeof defaults === "object") {
    const out = { ...defaults };
    if (!source || typeof source !== "object") return out;

    Object.keys(defaults).forEach((key) => {
      out[key] = mergeWithDefaults(source[key], defaults[key]);
    });

    return out;
  }

  return source === undefined ? defaults : source;
}
