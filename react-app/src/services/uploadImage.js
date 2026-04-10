import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { resizeImage } from "./resizeImage";

/**
 * Recommended resize options per image context, based on how the image is used in the UI.
 * Returns { maxWidth, maxHeight, quality }.
 */
export function getResizeOptionsFor(pathKey = "") {
  // Hero slides and large background images: wide, high-res
  if (pathKey.startsWith("hero") || pathKey.startsWith("visit")) {
    return { maxWidth: 1920, maxHeight: 1080, quality: 0.82 };
  }
  // Intro gallery and activity images: medium-large
  if (pathKey.startsWith("introGallery") || pathKey.startsWith("activitats")) {
    return { maxWidth: 1200, maxHeight: 1200, quality: 0.85 };
  }
  // Cards in the "Què hi trobarem" section: medium
  if (pathKey.startsWith("cards")) {
    return { maxWidth: 900, maxHeight: 900, quality: 0.85 };
  }
  // Logos and about images: smaller, higher quality
  if (pathKey.startsWith("about")) {
    return { maxWidth: 600, maxHeight: 600, quality: 0.9 };
  }
  // Game thumbnails: small
  if (pathKey.startsWith("game")) {
    return { maxWidth: 600, maxHeight: 600, quality: 0.85 };
  }
  // Safe default
  return { maxWidth: 1200, maxHeight: 1200, quality: 0.85 };
}

/**
 * Uploads an image file to Firebase Storage (with optional resizing) and returns the download URL.
 * @param {File} file - The image file to upload
 * @param {string} pathKey - A key used in the storage path (e.g. "hero.0")
 * @param {object} [options] - Resize options { maxWidth, maxHeight, quality, folder }
 * @returns {Promise<string>} - The download URL
 */
export async function uploadImage(file, pathKey, options = {}) {
  const { folder = "images", resize = true, ...overrides } = options;

  // If no explicit size was given, infer recommended options from the pathKey.
  const resizeOptions = {
    ...getResizeOptionsFor(pathKey),
    ...overrides,
  };

  const processed = resize ? await resizeImage(file, resizeOptions) : file;

  const safeKey = pathKey.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const ext = processed.name.split(".").pop() || "jpg";
  const storagePath = `${folder}/${safeKey}_${timestamp}.${ext}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, processed);
  return await getDownloadURL(storageRef);
}
