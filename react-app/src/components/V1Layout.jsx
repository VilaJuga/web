import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import VersionSwitcher from "./VersionSwitcher";
import { setSelectedVersion } from "../pages/VersionSelector";

export default function V1Layout() {
  const location = useLocation();

  useEffect(() => {
    setSelectedVersion("v1");
  }, [location.pathname]);

  return (
    <>
      <VersionSwitcher current="v1" />
      <Outlet />
    </>
  );
}
