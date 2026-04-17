import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { addGame, updateGame, deleteGame, applyBatch, GAMES_COLLECTION } from "../services/games";
import { fetchSheetAsCsv, diffGames } from "../services/importSheet";

/** Parses a range string like "2-4", "3-6", "1,2,3", "2" into {min, max}. */
export function parseRange(str) {
  if (!str) return null;
  const nums = String(str).match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  const values = nums.map(Number);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Parses an age string like "+10", "10", "+5" and returns the minimum age. */
export function parseMinNumber(str) {
  if (!str) return null;
  const match = String(str).match(/\d+/);
  return match ? Number(match[0]) : null;
}

const EMPTY_FILTERS = {
  name: "",
  editorial: "",
  players: "",
  age: "",
  timeFrom: "",
  timeTo: "",
};

export function useLudoteca(sheetId) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);
  const [diff, setDiff] = useState(null);
  const [importError, setImportError] = useState("");

  useEffect(() => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setGames(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Error loading games:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const editorials = useMemo(() => {
    const set = new Set(games.map((g) => g.editorial).filter(Boolean));
    return [...set].sort();
  }, [games]);

  const filtered = useMemo(() => {
    let list = games;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.editorial?.toLowerCase().includes(q)
      );
    }
    if (columnFilters.name) {
      const q = columnFilters.name.toLowerCase();
      list = list.filter((g) => (g.name || "").toLowerCase().includes(q));
    }
    if (columnFilters.editorial) {
      list = list.filter((g) => (g.editorial || "") === columnFilters.editorial);
    }
    if (columnFilters.players) {
      const num = parseInt(columnFilters.players, 10);
      if (!isNaN(num)) {
        list = list.filter((g) => {
          if (!g.players) return true;
          const range = parseRange(g.players);
          if (!range) return true;
          return num >= range.min && num <= range.max;
        });
      } else {
        const q = columnFilters.players.toLowerCase();
        list = list.filter((g) => !g.players || g.players.toLowerCase().includes(q));
      }
    }
    if (columnFilters.age) {
      const num = parseInt(columnFilters.age, 10);
      if (!isNaN(num)) {
        list = list.filter((g) => {
          if (!g.age) return true;
          const minAge = parseMinNumber(g.age);
          if (minAge === null) return true;
          return minAge <= num;
        });
      } else {
        const q = columnFilters.age.toLowerCase();
        list = list.filter((g) => !g.age || g.age.toLowerCase().includes(q));
      }
    }
    if (columnFilters.timeFrom || columnFilters.timeTo) {
      const userMin = columnFilters.timeFrom ? parseInt(columnFilters.timeFrom, 10) : 0;
      const userMax = columnFilters.timeTo ? parseInt(columnFilters.timeTo, 10) : Infinity;
      if (!isNaN(userMin) && !isNaN(userMax)) {
        list = list.filter((g) => {
          if (!g.time) return true;
          const range = parseRange(g.time);
          if (!range) return true;
          return range.min <= userMax && range.max >= userMin;
        });
      }
    }
    const collator = new Intl.Collator("ca", {
      sensitivity: "base",
      ignorePunctuation: true,
      numeric: true,
    });
    list = [...list].sort((a, b) => {
      const va = (a[sortBy] || "").toString();
      const vb = (b[sortBy] || "").toString();
      const cmp = collator.compare(va, vb);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [games, search, columnFilters, sortBy, sortDir]);

  const hasActiveColumnFilters = Object.values(columnFilters).some((v) => v);

  function setColumnFilter(col, value) {
    setColumnFilters((prev) => ({ ...prev, [col]: value }));
  }
  function clearColumnFilters() {
    setColumnFilters(EMPTY_FILTERS);
  }

  function handleSort(column) {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  }

  async function handleSaveGame(gameData) {
    try {
      if (editing === "new") {
        await addGame(gameData);
      } else if (editing?.id) {
        await updateGame(editing.id, gameData);
      }
      setEditing(null);
    } catch (err) {
      alert("Error guardant: " + err.message);
    }
  }

  async function handleDeleteGame(game) {
    if (!confirm(`Eliminar "${game.name}"?`)) return;
    try {
      await deleteGame(game.id);
    } catch (err) {
      alert("Error eliminant: " + err.message);
    }
  }

  async function handleImportClick() {
    setImporting(true);
    setImportError("");
    try {
      const sheetGames = await fetchSheetAsCsv(sheetId);
      const computedDiff = diffGames(sheetGames, games);
      setDiff(computedDiff);
    } catch (err) {
      setImportError(err.message);
    } finally {
      setImporting(false);
    }
  }

  async function handleApplyDiff({ applyAdds, applyUpdates, applyDeletes }) {
    const ops = [];
    if (applyAdds) {
      for (const item of diff.toAdd) ops.push({ type: "add", data: item.data });
    }
    if (applyUpdates) {
      for (const item of diff.toUpdate)
        ops.push({ type: "update", id: item.id, data: item.data });
    }
    if (applyDeletes) {
      for (const item of diff.toDelete) ops.push({ type: "delete", id: item.id });
    }
    try {
      await applyBatch(ops);
      setDiff(null);
    } catch (err) {
      alert("Error aplicant canvis: " + err.message);
    }
  }

  function handleExportCsv() {
    const headers = ["NOM JOC", "EDITORIAL", "NÚMERO JUGADORS", "EDAT", "TEMPS PARTIDA"];
    const rows = games.map((g) => [g.name, g.editorial, g.players, g.age, g.time]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const s = (cell || "").toString();
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ludoteca-vilajuga.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    games,
    filtered,
    loading,
    search,
    setSearch,
    columnFilters,
    setColumnFilter,
    clearColumnFilters,
    hasActiveColumnFilters,
    sortBy,
    sortDir,
    handleSort,
    editorials,
    editing,
    setEditing,
    importing,
    importError,
    diff,
    setDiff,
    handleSaveGame,
    handleDeleteGame,
    handleImportClick,
    handleApplyDiff,
    handleExportCsv,
  };
}
