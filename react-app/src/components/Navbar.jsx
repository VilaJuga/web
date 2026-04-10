import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext";
import { EditableText } from "./Editable";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data } = useSiteData();
  const location = useLocation();

  // Detect the currently active version from the URL.
  // If we're inside /v1/... the nav links should stay in /v1/..., same for /v2.
  const match = location.pathname.match(/^\/(v[12])(?:\/|$)/);
  const version = match?.[1] || "v1";

  function resolvePath(raw) {
    if (!raw) return `/${version}`;
    // Home shortcut
    if (raw === "/" || raw === `/${version}`) return `/${version}`;
    // If the link already starts with /v1 or /v2, strip that and re-prefix with current version
    const stripped = raw.replace(/^\/v[12]/, "");
    const clean = stripped.startsWith("/") ? stripped : `/${stripped}`;
    return `/${version}${clean}`;
  }

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <button
          className="menu-toggle"
          aria-label="Obrir menú"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <nav>
          <ul className={`nav-links${open ? " open" : ""}`}>
            {data.navLinks.map((link, i) => (
              <li key={link.path}>
                <NavLink
                  to={resolvePath(link.path)}
                  end={link.path === "/"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setOpen(false)}
                >
                  <EditableText
                    path={`navLinks.${i}.label`}
                    value={link.label}
                    tag="span"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
