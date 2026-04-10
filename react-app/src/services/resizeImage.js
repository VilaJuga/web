/**
 * Resizes and compresses an image file using canvas before upload.
 * Returns a new File object (JPEG) that's much smaller than the original.
 *
 * @param {File} file - Original image file
 * @param {object} options
 * @param {number} options.maxWidth - Max width in pixels (default 600)
 * @param {number} options.maxHeight - Max height in pixels (default 600)
 * @param {number} options.quality - JPEG quality 0-1 (default 0.85)
 * @returns {Promise<File>}
 */
export async function resizeImage(file, { maxWidth = 600, maxHeight = 600, quality = 0.85 } = {}) {
  if (!file.type.startsWith("image/")) {
    throw new Error("L'arxiu no és una imatge");
  }

  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality
    )
  );

  const originalName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${originalName}.jpg`, { type: "image/jpeg" });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
