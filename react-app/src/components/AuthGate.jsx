import { useAuth } from "../context/AuthContext";
import ForcePasswordChange from "./ForcePasswordChange";

/** Blocks the app behind a forced password change if the logged-in user needs it. */
export default function AuthGate({ children }) {
  const { mustChangePassword, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Carregant...
      </div>
    );
  }

  if (mustChangePassword) {
    return <ForcePasswordChange />;
  }

  return children;
}
