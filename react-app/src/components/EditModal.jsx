import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { uploadImage } from "../services/uploadImage";

export default function EditModal({ value, type, pathKey, onSave, onCancel }) {
  const [draft, setDraft] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, pathKey || "image");
      setDraft(url);
    } catch (err) {
      console.error(err);
      setError("Error pujant la imatge: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return createPortal(
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{type === "image" ? "Editar imatge" : "Editar text"}</h3>
        {type === "image" ? (
          <>
            <label>Pujar una imatge des del teu ordinador:</label>
            <button
              type="button"
              className="admin-btn cancel"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ marginBottom: "1rem", width: "100%" }}
            >
              {uploading ? "Pujant..." : "Triar arxiu"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label>O bé enganxa una URL:</label>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={uploading}
            />

            {error && <p style={{ color: "var(--accent)", fontSize: "0.85rem" }}>{error}</p>}

            {draft && !uploading && (
              <img className="admin-modal-preview" src={draft} alt="Preview" />
            )}
          </>
        ) : (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(3, String(draft).split("\n").length + 1)}
          />
        )}
        <div className="admin-modal-actions">
          <button className="admin-btn cancel" onClick={onCancel} disabled={uploading}>
            Cancelar
          </button>
          <button
            className="admin-btn save"
            onClick={() => onSave(draft)}
            disabled={uploading}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
