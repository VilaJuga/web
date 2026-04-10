import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  getAllUsers,
  createUser,
  updateUserPermissions,
  resetUserPassword,
  deleteUser,
} from "../services/users";
import { SUPERADMIN_USERNAME } from "../constants/permissions";
import UserEditModal from "./UserEditModal";

function permissionsSummary(p) {
  const parts = [];
  if (p?.textos?.modificar) parts.push("Textos");
  const t = p?.tarjetas || {};
  if (t.añadir || t.eliminar || t.modificar) {
    const actions = [t.añadir && "+", t.eliminar && "×", t.modificar && "✎"]
      .filter(Boolean)
      .join("");
    parts.push(`Targetes${actions}`);
  }
  const j = p?.juegos || {};
  if (j.añadir || j.eliminar || j.modificar) {
    const actions = [j.añadir && "+", j.eliminar && "×", j.modificar && "✎"]
      .filter(Boolean)
      .join("");
    parts.push(`Jocs${actions}`);
  }
  if (p?.administrar) parts.push("Admin");
  return parts.length ? parts.join(" · ") : "Sense permisos";
}

export default function UsersModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | user object
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllUsers();
      setUsers(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave({ username, permissions }) {
    if (editing === "new") {
      await createUser(username, permissions);
    } else if (editing?.username) {
      await updateUserPermissions(editing.username, permissions);
    }
    setEditing(null);
    await load();
  }

  async function handleReset(user) {
    if (!confirm(`Restablir la contrasenya de "${user.username}" a la contrasenya per defecte?`))
      return;
    setBusy(user.username);
    try {
      await resetUserPassword(user.username);
      alert("Contrasenya restablerta. L'usuari haurà de canviar-la al pròxim accés.");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setBusy("");
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Eliminar definitivament l'usuari "${user.username}"?`)) return;
    setBusy(user.username);
    try {
      await deleteUser(user.username);
      await load();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setBusy("");
    }
  }

  return createPortal(
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal users-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="users-modal-header">
          <h3>Gestió d'usuaris</h3>
          <button className="admin-btn save" onClick={() => setEditing("new")}>
            + Nou usuari
          </button>
        </div>

        {loading ? (
          <p>Carregant...</p>
        ) : (
          <div className="users-list">
            {users.map((u) => {
              const isSuper = u.username === SUPERADMIN_USERNAME;
              return (
                <div key={u.username} className={`user-row${isSuper ? " super" : ""}`}>
                  <div className="user-info">
                    <div className="user-name">
                      {u.username}
                      {isSuper && <span className="super-badge">SUPERADMIN</span>}
                      {u.mustChangePassword && !isSuper && (
                        <span className="pwchange-badge">ha de canviar contrasenya</span>
                      )}
                    </div>
                    <div className="user-perms">{permissionsSummary(u.permissions)}</div>
                  </div>
                  <div className="user-actions">
                    {!isSuper && (
                      <>
                        <button
                          className="icon-btn"
                          onClick={() => setEditing(u)}
                          title="Editar permisos"
                          disabled={busy === u.username}
                        >
                          ✎
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleReset(u)}
                          title="Restablir contrasenya"
                          disabled={busy === u.username}
                        >
                          🔑
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(u)}
                          title="Eliminar"
                          disabled={busy === u.username}
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-modal-actions">
          <button className="admin-btn cancel" onClick={onClose}>
            Tancar
          </button>
        </div>
      </div>

      {editing && (
        <UserEditModal
          mode={editing === "new" ? "create" : "edit"}
          user={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>,
    document.body
  );
}
