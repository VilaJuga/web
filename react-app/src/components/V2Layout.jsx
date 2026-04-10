import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import VersionSwitcher from "./VersionSwitcher";
import { setSelectedVersion } from "../pages/VersionSelector";

export default function V2Layout() {
  const location = useLocation();

  useEffect(() => {
    setSelectedVersion("v2");
  }, [location.pathname]);

  return (
    <div className="v2-root">
      <VersionSwitcher current="v2" />
      <Outlet />
    </div>
  );
}
