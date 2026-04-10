import Papa from "papaparse";

/** Fetches a public Google Sheet as CSV and parses it.
 * Uses the gviz endpoint which supports CORS, unlike /export which often does not.
 */
export async function fetchSheetAsCsv(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=1`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(
      "No s'ha pogut connectar amb Google Sheets (potser és un error de xarxa o CORS): " + err.message
    );
  }
  if (!res.ok) {
    throw new Error(`No s'ha pogut descarregar el full (HTTP ${res.status}). Comprova que el full és públic.`);
  }
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    console.warn("CSV parse errors:", parsed.errors);
  }
  const rows = parsed.data.map(normalizeHeaders).filter((r) => r.name);
  if (rows.length === 0) {
    throw new Error(
      "El full s'ha descarregat però no s'ha trobat cap joc. Comprova que la primera fila conté els encapçalaments: NOM JOC, EDITORIAL, NÚMERO JUGADORS, EDAT, TEMPS PARTIDA"
    );
  }
  return rows;
}

/** Normalize the Catalan sheet headers to our schema. */
function normalizeHeaders(row) {
  // The sheet headers may contain line breaks (e.g. "NÚMERO \nJUGADORS")
  // so we look for any key containing a keyword.
  const find = (keyword) => {
    const key = Object.keys(row).find((k) =>
      k.toUpperCase().replace(/\s+/g, " ").includes(keyword)
    );
    return key ? row[key]?.trim() : "";
  };

  return {
    name: find("NOM JOC"),
    editorial: find("EDITORIAL"),
    players: find("JUGADORS"),
    age: find("EDAT"),
    time: find("TEMPS"),
  };
}

/** Compares sheet data with the current DB and returns a diff.
 * Games are matched by normalized name.
 */
export function diffGames(sheetGames, dbGames) {
  const normalize = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, " ");
  const dbByName = new Map();
  for (const g of dbGames) dbByName.set(normalize(g.name), g);

  const toAdd = [];
  const toUpdate = [];
  const unchanged = [];
  const seen = new Set();

  for (const sheetGame of sheetGames) {
    const key = normalize(sheetGame.name);
    if (!key) continue;
    seen.add(key);
    const existing = dbByName.get(key);

    if (!existing) {
      toAdd.push({ data: sheetGame });
    } else {
      const fields = ["editorial", "players", "age", "time"];
      const changes = {};
      let changed = false;
      for (const f of fields) {
        const newVal = sheetGame[f] || "";
        const oldVal = existing[f] || "";
        if (newVal !== oldVal) {
          changes[f] = { from: oldVal, to: newVal };
          changed = true;
        }
      }
      // Also check if name case changed
      if (existing.name !== sheetGame.name) {
        changes.name = { from: existing.name, to: sheetGame.name };
        changed = true;
      }

      if (changed) {
        toUpdate.push({ id: existing.id, existing, data: sheetGame, changes });
      } else {
        unchanged.push(existing);
      }
    }
  }

  const toDelete = [];
  for (const g of dbGames) {
    const key = normalize(g.name);
    if (!seen.has(key)) toDelete.push(g);
  }

  return { toAdd, toUpdate, toDelete, unchanged };
}
