// ── Permission model ──────────────────────────────────────────
// Each user has a `permissions` object with the following shape:
//
// {
//   textos:    { modificar: boolean },
//   tarjetas:  { añadir: boolean, eliminar: boolean, modificar: boolean },
//   juegos:    { añadir: boolean, eliminar: boolean, modificar: boolean },
//   administrar: boolean,
// }
//
// The `can(permissions, resource, action)` helper checks a single permission.

export const DEFAULT_PASSWORD = "VilajugaAdmin";
export const SUPERADMIN_USERNAME = "Gioconda";
export const SUPERADMIN_PASSWORD = "MonaLisa";

export const EMPTY_PERMISSIONS = {
  textos: { modificar: false },
  tarjetas: { añadir: false, eliminar: false, modificar: false },
  juegos: { añadir: false, eliminar: false, modificar: false },
  administrar: false,
};

export const FULL_PERMISSIONS = {
  textos: { modificar: true },
  tarjetas: { añadir: true, eliminar: true, modificar: true },
  juegos: { añadir: true, eliminar: true, modificar: true },
  administrar: true,
};

/** Returns true if `permissions` grants `resource.action`. */
export function can(permissions, resource, action = null) {
  if (!permissions) return false;
  if (resource === "administrar") return !!permissions.administrar;
  if (!action) return false;
  return !!permissions[resource]?.[action];
}

/** Ensures a permissions object has all required keys, filling missing with false. */
export function normalizePermissions(p) {
  return {
    textos: { modificar: !!p?.textos?.modificar },
    tarjetas: {
      añadir: !!p?.tarjetas?.añadir,
      eliminar: !!p?.tarjetas?.eliminar,
      modificar: !!p?.tarjetas?.modificar,
    },
    juegos: {
      añadir: !!p?.juegos?.añadir,
      eliminar: !!p?.juegos?.eliminar,
      modificar: !!p?.juegos?.modificar,
    },
    administrar: !!p?.administrar,
  };
}
