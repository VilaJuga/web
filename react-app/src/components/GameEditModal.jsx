import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { uploadImage } from "../services/uploadImage";

const EMPTY = { name: "", editorial: "", players: "", age: "", time: "", image: "" };

export default function GameEditModal({ game, onSave, onCancel }) {
  const [draft, setDraft] = useState(game || EMPTY);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setDraft(game || EMPTY);
  }, [game]);

  function set(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, `game_${draft.name || "new"}`, {
        folder: "games",
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.85,
      });
      set("image", url);
    } catch (err) {
      console.error(err);
      setError("Error pujant la imatge: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSave() {
    if (!draft.name?.trim()) {
      setError("El nom és obligatori");
      return;
    }
    setError("");
    onSave({
      name: draft.name.trim(),
      editorial: draft.editorial?.trim() || "",
      players: draft.players?.trim() || "",
      age: draft.age?.trim() || "",
      time: draft.time?.trim() || "",
      image: draft.image?.trim() || "",
    });
  }

  return createPortal(
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{game?.id ? "Editar joc" : "Nou joc"}</h3>

        <label>Nom del joc</label>
        <input type="text" value={draft.name} onChange={(e) => set("name", e.target.value)} autoFocus />

        <label>Editorial</label>
        <input type="text" value={draft.editorial} onChange={(e) => set("editorial", e.target.value)} />

        <label>Número de jugadors</label>
        <input type="text" value={draft.players} onChange={(e) => set("players", e.target.value)} placeholder="ex: 2-4" />

        <label>Edat</label>
        <input type="text" value={draft.age} onChange={(e) => set("age", e.target.value)} placeholder="ex: +8" />

        <label>Temps de partida (min)</label>
        <input type="text" value={draft.time} onChange={(e) => set("time", e.target.value)} placeholder="ex: 30" />

        <label>Imatge del joc</label>
        <button
          type="button"
          className="admin-btn cancel"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ marginBottom: "0.5rem", width: "100%" }}
        >
          {uploading ? "Pujant i optimitzant..." : "Pujar imatge des de l'ordinador"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <input
          type="text"
          value={draft.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="O enganxa una URL"
          disabled={uploading}
        />
        {draft.image && !uploading && (
          <img className="admin-modal-preview" src={draft.image} alt="Preview" />
        )}

        {error && <p style={{ color: "var(--accent)", fontSize: "0.85rem" }}>{error}</p>}

        <div className="admin-modal-actions">
          <button className="admin-btn cancel" onClick={onCancel} disabled={uploading}>Cancelar</button>
          <button className="admin-btn save" onClick={handleSave} disabled={uploading}>Guardar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
