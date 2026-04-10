import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_PASSWORD } from "../constants/permissions";

export default function ChangePasswordModal({ onClose }) {
  const { changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("La contrasenya ha de tenir almenys 6 caràcters");
      return;
    }
    if (newPassword === DEFAULT_PASSWORD) {
      setError("No pots utilitzar la contrasenya per defecte");
      return;
    }
    if (newPassword !== confirm) {
      setError("Les contrasenyes no coincideixen");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(newPassword);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="admin-modal-overlay" onClick={onClose}>
      <form
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>Canviar contrasenya</h3>
        {success ? (
          <p style={{ color: "green" }}>✓ Contrasenya canviada correctament</p>
        ) : (
          <>
            {error && <p className="login-error">{error}</p>}
            <label>Nova contrasenya</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
              autoComplete="new-password"
              minLength={6}
            />
            <label>Confirmar contrasenya</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={6}
            />
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button type="submit" className="admin-btn save" disabled={submitting}>
                {submitting ? "Guardant..." : "Guardar"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>,
    document.body
  );
}
