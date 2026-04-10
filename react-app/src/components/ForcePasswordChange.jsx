import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_PASSWORD } from "../constants/permissions";

export default function ForcePasswordChange() {
  const { user, changePassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("La contrasenya ha de tenir almenys 6 caràcters");
      return;
    }
    if (newPassword === DEFAULT_PASSWORD) {
      setError("No pots reutilitzar la contrasenya per defecte");
      return;
    }
    if (newPassword !== confirm) {
      setError("Les contrasenyes no coincideixen");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(newPassword);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="force-pw-overlay">
      <form className="force-pw-box" onSubmit={handleSubmit}>
        <h2>Canvi de contrasenya obligatori</h2>
        <p className="force-pw-intro">
          Hola <strong>{user?.username}</strong>, estàs utilitzant la contrasenya per defecte.
          Abans de continuar has d'establir una contrasenya nova.
        </p>
        {error && <p className="login-error">{error}</p>}
        <label>
          Nova contrasenya
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoFocus
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <label>
          Confirmar contrasenya
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <div className="login-actions">
          <button className="admin-btn save" type="submit" disabled={submitting}>
            {submitting ? "Guardant..." : "Guardar nova contrasenya"}
          </button>
          <button type="button" className="admin-btn cancel" onClick={logout}>
            Cancelar sessió
          </button>
        </div>
      </form>
    </div>
  );
}
