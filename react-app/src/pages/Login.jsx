import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(username.trim(), password);
      if (result.ok) {
        navigate("/");
      } else {
        setError(result.error || "Credencials incorrectes");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (isAdmin) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Sessió activa</h2>
          <p>
            Estàs connectat com a <strong>{user.username}</strong>.
            {user.permissions?.administrar && " (Administrador)"}
          </p>
          <div className="login-actions">
            <button className="admin-btn save" onClick={() => navigate("/")}>
              Anar a la web
            </button>
            <button
              className="admin-btn cancel"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Tancar sessió
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Accés Admin</h2>
        {error && <p className="login-error">{error}</p>}
        <label>
          Usuari
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </label>
        <label>
          Contrasenya
          <div className="pw-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Amagar contrasenya" : "Mostrar contrasenya"}
              title={showPassword ? "Amagar" : "Mostrar"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </label>
        <button className="admin-btn save" type="submit" disabled={submitting}>
          {submitting ? "Entrant..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
