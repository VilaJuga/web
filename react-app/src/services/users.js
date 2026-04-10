import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { hashPassword, verifyPassword } from "./crypto";
import {
  DEFAULT_PASSWORD,
  SUPERADMIN_USERNAME,
  SUPERADMIN_PASSWORD,
  FULL_PERMISSIONS,
  EMPTY_PERMISSIONS,
  normalizePermissions,
} from "../constants/permissions";

export const USERS_COLLECTION = "users";

function userRef(username) {
  return doc(db, USERS_COLLECTION, username);
}

/** Returns the user document or null. */
export async function getUser(username) {
  const snap = await getDoc(userRef(username));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Returns all users sorted by username. */
export async function getAllUsers() {
  const snap = await getDocs(collection(db, USERS_COLLECTION));
  const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  users.sort((a, b) => a.username.localeCompare(b.username));
  return users;
}

/** Ensures the Gioconda super-admin exists with correct password and permissions.
 *  If missing, creates it. If present but tampered, restores core fields. */
export async function ensureSuperAdmin() {
  try {
    const existing = await getUser(SUPERADMIN_USERNAME);
    if (!existing) {
      const passwordHash = await hashPassword(SUPERADMIN_PASSWORD);
      await setDoc(userRef(SUPERADMIN_USERNAME), {
        username: SUPERADMIN_USERNAME,
        passwordHash,
        mustChangePassword: false,
        isSuperAdmin: true,
        permissions: FULL_PERMISSIONS,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    // Repair if tampered: ensure isSuperAdmin flag + full permissions + valid password
    const needsRepair =
      !existing.isSuperAdmin ||
      JSON.stringify(existing.permissions) !== JSON.stringify(FULL_PERMISSIONS) ||
      !existing.passwordHash;

    if (needsRepair) {
      const patch = {
        isSuperAdmin: true,
        permissions: FULL_PERMISSIONS,
        updatedAt: serverTimestamp(),
      };
      if (!existing.passwordHash) {
        patch.passwordHash = await hashPassword(SUPERADMIN_PASSWORD);
        patch.mustChangePassword = false;
      }
      await updateDoc(userRef(SUPERADMIN_USERNAME), patch);
    }
  } catch (err) {
    console.error("Error ensuring super admin:", err);
  }
}

/** Attempts login. Returns the user doc (minus passwordHash) on success, or null. */
export async function login(username, password) {
  if (!username || !password) return null;
  const user = await getUser(username);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

/** Creates a new user with default password and forced change on first login. */
export async function createUser(username, permissions) {
  if (!username?.trim()) throw new Error("El nom d'usuari és obligatori");
  const trimmed = username.trim();
  if (trimmed === SUPERADMIN_USERNAME) {
    throw new Error(`No es pot crear un usuari amb el nom reservat "${SUPERADMIN_USERNAME}"`);
  }
  const existing = await getUser(trimmed);
  if (existing) throw new Error("Ja existeix un usuari amb aquest nom");

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  await setDoc(userRef(trimmed), {
    username: trimmed,
    passwordHash,
    mustChangePassword: true,
    isSuperAdmin: false,
    permissions: normalizePermissions(permissions || EMPTY_PERMISSIONS),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Updates a user's permissions. Super-admin cannot be modified. */
export async function updateUserPermissions(username, permissions) {
  if (username === SUPERADMIN_USERNAME) {
    throw new Error("No es poden modificar els permisos del super-admin");
  }
  await updateDoc(userRef(username), {
    permissions: normalizePermissions(permissions),
    updatedAt: serverTimestamp(),
  });
}

/** Changes a user's own password. Clears mustChangePassword flag. */
export async function changeUserPassword(username, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("La contrasenya ha de tenir almenys 6 caràcters");
  }
  if (newPassword === DEFAULT_PASSWORD) {
    throw new Error("La nova contrasenya no pot ser la contrasenya per defecte");
  }
  const passwordHash = await hashPassword(newPassword);
  await updateDoc(userRef(username), {
    passwordHash,
    mustChangePassword: false,
    updatedAt: serverTimestamp(),
  });
}

/** Admin action: resets a user's password back to default, forcing change on next login. */
export async function resetUserPassword(username) {
  if (username === SUPERADMIN_USERNAME) {
    throw new Error("No es pot restablir la contrasenya del super-admin");
  }
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  await updateDoc(userRef(username), {
    passwordHash,
    mustChangePassword: true,
    updatedAt: serverTimestamp(),
  });
}

/** Admin action: deletes a user. Super-admin cannot be deleted. */
export async function deleteUser(username) {
  if (username === SUPERADMIN_USERNAME) {
    throw new Error("No es pot eliminar el super-admin");
  }
  await deleteDoc(userRef(username));
}
