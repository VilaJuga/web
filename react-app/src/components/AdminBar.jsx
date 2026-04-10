import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import UsersModal from "./UsersModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function AdminBar() {
  const { isAdmin, logout, user, can } = useAuth();
  const { restoreFromSeed, resetToDefaults } = useSiteData();
  const navigate = useNavigate();
  const [restoreMenuOpen, setRestoreMenuOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("is-admin", isAdmin);
    return () => document.body.classList.remove("is-admin");
  }, [isAdmin]);

  if (!isAdmin) return null;

  const canAdmin = can("administrar");

  async function handleRestoreHero() {
    if (confirm("Restaurar els slides del hero des del seed inicial?")) {
      await restoreFromSeed("images", "hero");
      setRestoreMenuOpen(false);
    }
  }

  async function handleResetAll() {
    if (confirm("ATENCIÓ: Això esborrarà TOTS els canvis. Continuar?")) {
      await resetToDefaults();
      setRestoreMenuOpen(false);
    }
  }

  return (
    <>
      <div className="admin-bar">
        <span>
          {user?.username}
          {canAdmin && " · Admin"}
        </span>
        <div className="admin-bar-actions">
          {canAdmin && (
            <div className="admin-bar-dropdown">
              <button onClick={() => setRestoreMenuOpen(!restoreMenuOpen)}>
                Restaurar ▾
              </button>
              {restoreMenuOpen && (
                <div className="admin-bar-menu">
                  <button onClick={handleRestoreHero}>Restaurar Hero</button>
                  <button onClick={handleResetAll} className="danger">
                    Restaurar tot
                  </button>
                </div>
              )}
            </div>
          )}
          {canAdmin && (
            <button onClick={() => setUsersOpen(true)}>Usuaris</button>
          )}
          <button onClick={() => setPwOpen(true)}>Canviar contrasenya</button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Tancar sessió
          </button>
        </div>
      </div>

      {usersOpen && <UsersModal onClose={() => setUsersOpen(false)} />}
      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
    </>
  );
}
