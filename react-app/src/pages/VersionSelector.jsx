import { Navigate, useNavigate } from "react-router-dom";

const KEY = "vilajuga_home_version";

export default function VersionSelector() {
  const navigate = useNavigate();

  const saved = sessionStorage.getItem(KEY);
  if (saved === "v1" || saved === "v2") {
    return <Navigate to={"/" + saved} replace />;
  }

  function choose(version) {
    sessionStorage.setItem(KEY, version);
    navigate("/" + version);
  }

  return (
    <div className="version-selector">
      <div className="version-selector-content">
        <h1>VilaJuga</h1>
        <p className="version-selector-tagline">Tria com vols veure la web</p>

        <div className="version-grid">
          <button className="version-card v1" onClick={() => choose("v1")}>
            <div className="version-tag">V1</div>
            <h2>Versió clàssica</h2>
            <p>El disseny original, net i directe.</p>
            <span className="version-cta">Entrar →</span>
          </button>

          <button className="version-card v2" onClick={() => choose("v2")}>
            <div className="version-tag">V2</div>
            <h2>Versió moderna</h2>
            <p>Nou disseny visual, amb més efectes i UX renovat.</p>
            <span className="version-cta">Entrar →</span>
          </button>
        </div>

        <p className="version-note">Pots canviar de versió en qualsevol moment des del botó a la cantonada.</p>
      </div>
    </div>
  );
}

export function getSelectedVersion() {
  const saved = sessionStorage.getItem(KEY);
  return saved === "v2" ? "v2" : "v1";
}

export function setSelectedVersion(v) {
  sessionStorage.setItem(KEY, v);
}
