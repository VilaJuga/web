import { useNavigate, useLocation } from "react-router-dom";
import { setSelectedVersion } from "../pages/VersionSelector";

export default function VersionSwitcher({ current }) {
  const navigate = useNavigate();
  const location = useLocation();
  const other = current === "v1" ? "v2" : "v1";

  function switchTo() {
    setSelectedVersion(other);
    // Preserve sub-path: replace /v1/foo/bar with /v2/foo/bar (or vice versa)
    const path = location.pathname;
    const match = path.match(/^\/v[12](\/.*)?$/);
    const rest = match?.[1] || "";
    navigate("/" + other + rest);
  }

  return (
    <button
      className="version-switcher"
      onClick={switchTo}
      title={`Canviar a la versió ${other.toUpperCase()}`}
    >
      <span className="vs-current">{current.toUpperCase()}</span>
      <span className="vs-arrow">→</span>
      <span className="vs-other">{other.toUpperCase()}</span>
    </button>
  );
}
