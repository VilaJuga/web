import { useAuth } from "../context/AuthContext";

/** Small "X" delete button shown in admin mode over list items.
 *  Hidden unless the user has the required permission. */
export function DeleteButton({ onClick, label = "Eliminar", resource = "textos", action = "modificar" }) {
  const { can } = useAuth();
  if (!can(resource, action)) return null;

  return (
    <button
      type="button"
      className="admin-delete-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Segur que vols eliminar-ho?")) onClick();
      }}
      title={label}
      aria-label={label}
    >
      ×
    </button>
  );
}

/** "+ Afegir" button shown in admin mode at the end of a list. */
export function AddButton({ onClick, label = "Afegir", resource = "textos", action = "modificar" }) {
  const { can } = useAuth();
  if (!can(resource, action)) return null;

  return (
    <button
      type="button"
      className="admin-add-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      + {label}
    </button>
  );
}
