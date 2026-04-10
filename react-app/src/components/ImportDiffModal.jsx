import { useState } from "react";

export default function ImportDiffModal({ diff, onApply, onCancel }) {
  const { toAdd, toUpdate, toDelete, unchanged } = diff;
  const [applyAdds, setApplyAdds] = useState(true);
  const [applyUpdates, setApplyUpdates] = useState(true);
  const [applyDeletes, setApplyDeletes] = useState(false); // opt-in for safety
  const [busy, setBusy] = useState(false);

  const totalChanges =
    (applyAdds ? toAdd.length : 0) +
    (applyUpdates ? toUpdate.length : 0) +
    (applyDeletes ? toDelete.length : 0);

  async function handleApply() {
    setBusy(true);
    try {
      await onApply({ applyAdds, applyUpdates, applyDeletes });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={busy ? undefined : onCancel}>
      <div className="admin-modal import-diff-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Importar des de Google Sheet</h3>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: 0 }}>
          S'han comparat les dades del full amb la base de dades. Revisa els canvis abans d'aplicar-los.
        </p>

        <div className="diff-summary">
          <div className="diff-stat unchanged">
            <span className="badge">{unchanged.length}</span> Sense canvis
          </div>
          <div className="diff-stat added">
            <span className="badge">{toAdd.length}</span> Per afegir
          </div>
          <div className="diff-stat updated">
            <span className="badge">{toUpdate.length}</span> Per actualitzar
          </div>
          <div className="diff-stat deleted">
            <span className="badge">{toDelete.length}</span> Al full ja no existeixen
          </div>
        </div>

        <label className="diff-checkbox">
          <input type="checkbox" checked={applyAdds} onChange={(e) => setApplyAdds(e.target.checked)} />
          Afegir {toAdd.length} jocs nous
        </label>
        {toAdd.length > 0 && (
          <ul className="diff-list added-list">
            {toAdd.slice(0, 10).map((item, i) => (
              <li key={i}>
                <strong>{item.data.name}</strong> — {item.data.editorial}
              </li>
            ))}
            {toAdd.length > 10 && <li>...i {toAdd.length - 10} més</li>}
          </ul>
        )}

        <label className="diff-checkbox">
          <input type="checkbox" checked={applyUpdates} onChange={(e) => setApplyUpdates(e.target.checked)} />
          Actualitzar {toUpdate.length} jocs modificats
        </label>
        {toUpdate.length > 0 && (
          <ul className="diff-list updated-list">
            {toUpdate.slice(0, 10).map((item, i) => (
              <li key={i}>
                <strong>{item.data.name}</strong>
                <div className="change-details">
                  {Object.entries(item.changes).map(([field, { from, to }]) => (
                    <div key={field}>
                      <em>{field}:</em>{" "}
                      <span className="old">{from || "∅"}</span> → <span className="new">{to || "∅"}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
            {toUpdate.length > 10 && <li>...i {toUpdate.length - 10} més</li>}
          </ul>
        )}

        <label className="diff-checkbox">
          <input type="checkbox" checked={applyDeletes} onChange={(e) => setApplyDeletes(e.target.checked)} />
          Eliminar {toDelete.length} jocs que ja no són al full (⚠️ irreversible)
        </label>
        {toDelete.length > 0 && applyDeletes && (
          <ul className="diff-list deleted-list">
            {toDelete.slice(0, 10).map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> — {item.editorial}
              </li>
            ))}
            {toDelete.length > 10 && <li>...i {toDelete.length - 10} més</li>}
          </ul>
        )}

        <div className="admin-modal-actions">
          <button className="admin-btn cancel" onClick={onCancel} disabled={busy}>
            Cancelar
          </button>
          <button
            className="admin-btn save"
            onClick={handleApply}
            disabled={busy || totalChanges === 0}
          >
            {busy ? "Aplicant..." : `Aplicar ${totalChanges} canvis`}
          </button>
        </div>
      </div>
    </div>
  );
}
