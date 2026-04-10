import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const GAMES_COLLECTION = "games";

export async function addGame(game) {
  return addDoc(collection(db, GAMES_COLLECTION), {
    ...game,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateGame(id, game) {
  return updateDoc(doc(db, GAMES_COLLECTION, id), {
    ...game,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGame(id) {
  return deleteDoc(doc(db, GAMES_COLLECTION, id));
}

/** Applies a batch of operations atomically (Firestore limit: 500 ops/batch). */
export async function applyBatch(operations) {
  // operations: [{ type: "add"|"update"|"delete", id?, data? }]
  const chunks = [];
  for (let i = 0; i < operations.length; i += 450) {
    chunks.push(operations.slice(i, i + 450));
  }

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const op of chunk) {
      if (op.type === "add") {
        const ref = doc(collection(db, GAMES_COLLECTION));
        batch.set(ref, {
          ...op.data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (op.type === "update") {
        batch.update(doc(db, GAMES_COLLECTION, op.id), {
          ...op.data,
          updatedAt: serverTimestamp(),
        });
      } else if (op.type === "delete") {
        batch.delete(doc(db, GAMES_COLLECTION, op.id));
      }
    }
    await batch.commit();
  }
}
