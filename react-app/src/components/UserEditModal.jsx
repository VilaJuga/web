import { useState } from "react";
import { createPortal } from "react-dom";
import { EMPTY_PERMISSIONS, normalizePermissions } from "../constants/permissions";

const RESOURCE_LABELS = {
  textos: "Textos",
  tarjetas: "Targetes",
  juegos: "Jocs",
};

const ACTION_LABELS = {
  añadir: "Afegir",
  eliminar: "Eliminar",
  modificar: "Modificar",
};

export default function UserEditModal({ mode, user, onSave, onCancel }) {
  // mode: "create" | "edit"
  const [username, setUsername] = useState(user?.username || "");
  const [permissions, setPermissions] = useState(
    normalizePermissions(user?.permissions || EMPTY_PERMISSIONS)
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggle(resource, action) {
    setPermissions((prev) => {
      const next = { ...prev };
      if (action === null) {
        next[resource] = !prev[resource];
      } else {
        next[resource] = { ...prev[resource], [action]: !prev[resource][action] };
      }
      return next;
    });
  }

  async function handleSave() {
    setError("");
    if (mode === "create" && !username.trim()) {
      setError("El nom d'usuari és obligatori");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({ username: username.trim(), permissions });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === "create" ? "Nou usuari" : `Editar: ${user?.username}`}</h3>

        {mode === "create" && (
          <>
            <label>Nom d'usuari</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: joan"
              autoFocus
            />
            <p className="users-hint">
              La contrasenya per defecte serà <code>VilajugaAdmin</code>. L'usuari haurà de canviar-la en
              el primer accés.
            </p>
          </>
        )}

        <div className="perms-grid">
          {Object.entries(RESOURCE_LABELS).map(([resource, label]) => (
            <div key={resource} className="perms-row">
              <div className="perms-row-label">{label}</div>
              <div className="perms-row-actions">
                {Object.entries(permissions[resource]).map(([action]) => (
                  <label key={action} className="perms-checkbox">
                    <input
                      type="checkbox"
                      checked={!!permissions[resource][action]}
                      onChange={() => toggle(resource, action)}
                    />
                    <span>{ACTION_LABELS[action]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="perms-row admin-row">
            <div className="perms-row-label">Administrar</div>
            <div className="perms-row-actions">
              <label className="perms-checkbox">
                <input
                  type="checkbox"
                  checked={!!permissions.administrar}
                  onChange={() => toggle("administrar", null)}
                />
                <span>Gestionar usuaris, restaurar, etc.</span>
              </label>
            </div>
          </div>
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="admin-modal-actions">
          <button className="admin-btn cancel" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
          <button className="admin-btn save" onClick={handleSave} disabled={submitting}>
            {submitting ? "Guardant..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
