import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";
import { EditableText } from "../components/Editable";
import GameEditModal from "../components/GameEditModal";
import ImportDiffModal from "../components/ImportDiffModal";
import { useLudoteca } from "../hooks/useLudoteca";

export default function Ludoteca() {
  const { data } = useSiteData();
  const { can } = useAuth();
  const canAdd = can("juegos", "añadir");
  const canEdit = can("juegos", "modificar");
  const canDelete = can("juegos", "eliminar");
  const canAny = canAdd || canEdit || canDelete;
  const { title, description, sheetId, searchPlaceholder } = data.ludoteca;

  const L = useLudoteca(sheetId);

  return (
    <div className="page-container">
      <EditableText path="ludoteca.title" value={title} tag="h1" />
      <div className="divider center" />
      <EditableText path="ludoteca.description" value={description} tag="p" />

      <div className="ludoteca-toolbar">
        <input
          type="search"
          value={L.search}
          onChange={(e) => L.setSearch(e.target.value)}
          placeholder={searchPlaceholder || "Cerca..."}
          className="ludoteca-search"
        />

        {L.hasActiveColumnFilters && (
          <button className="ludoteca-clear-filters" onClick={L.clearColumnFilters}>
            Netejar filtres
          </button>
        )}

        <span className="ludoteca-count">
          {L.filtered.length} de {L.games.length} jocs
        </span>

        <div className="ludoteca-actions">
          <button className="btn-primary" onClick={L.handleExportCsv}>Descarregar CSV</button>
          {canAdd && (
            <>
              <button className="btn-primary" onClick={L.handleImportClick} disabled={L.importing}>
                {L.importing ? "Important..." : "Importar des del full"}
              </button>
              <button className="btn-primary" onClick={() => L.setEditing("new")}>+ Nou joc</button>
            </>
          )}
        </div>
      </div>

      {L.importError && <p className="form-feedback error">{L.importError}</p>}

      {L.loading ? (
        <p>Carregant jocs...</p>
      ) : (
        <div className="ludoteca-table-wrap">
          <table className="ludoteca-table">
            <thead>
              <tr>
                <th className="col-center">Imatge</th>
                <th onClick={() => L.handleSort("name")} className="sortable">
                  Nom del joc {L.sortBy === "name" && (L.sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => L.handleSort("editorial")} className="sortable">
                  Editorial {L.sortBy === "editorial" && (L.sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => L.handleSort("players")} className="sortable col-center">
                  Jugadors {L.sortBy === "players" && (L.sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => L.handleSort("age")} className="sortable col-center">
                  Edat {L.sortBy === "age" && (L.sortDir === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => L.handleSort("time")} className="sortable col-center">
                  Temps {L.sortBy === "time" && (L.sortDir === "asc" ? "▲" : "▼")}
                </th>
                {canAny && <th></th>}
              </tr>
              <tr className="filter-row">
                <th></th>
                <th>
                  <input
                    type="text"
                    value={L.columnFilters.name}
                    onChange={(e) => L.setColumnFilter("name", e.target.value)}
                    placeholder="Filtrar..."
                  />
                </th>
                <th>
                  <select
                    value={L.columnFilters.editorial}
                    onChange={(e) => L.setColumnFilter("editorial", e.target.value)}
                  >
                    <option value="">Totes</option>
                    {L.editorials.map((ed) => (
                      <option key={ed} value={ed}>{ed}</option>
                    ))}
                  </select>
                </th>
                <th>
                  <input
                    type="number"
                    value={L.columnFilters.players}
                    onChange={(e) => L.setColumnFilter("players", e.target.value.slice(0, 2))}
                    placeholder="ex: 3"
                    min="0"
                    max="99"
                    className="narrow-filter"
                  />
                </th>
                <th>
                  <input
                    type="number"
                    value={L.columnFilters.age}
                    onChange={(e) => L.setColumnFilter("age", e.target.value.slice(0, 2))}
                    placeholder="ex: 10"
                    min="0"
                    max="99"
                    className="narrow-filter"
                  />
                </th>
                <th>
                  <div className="time-range-filter">
                    <input
                      type="number"
                      value={L.columnFilters.timeFrom}
                      onChange={(e) => L.setColumnFilter("timeFrom", e.target.value.slice(0, 3))}
                      placeholder="des"
                      min="0"
                      max="999"
                    />
                    <input
                      type="number"
                      value={L.columnFilters.timeTo}
                      onChange={(e) => L.setColumnFilter("timeTo", e.target.value.slice(0, 3))}
                      placeholder="fins"
                      min="0"
                      max="999"
                    />
                  </div>
                </th>
                {canAny && <th></th>}
              </tr>
            </thead>
            <tbody>
              {L.filtered.map((g) => (
                <tr key={g.id}>
                  <td className="col-center game-image-cell">
                    {g.image ? (
                      <img src={g.image} alt={g.name} loading="lazy" className="game-thumb" />
                    ) : (
                      <span className="game-thumb-placeholder">—</span>
                    )}
                  </td>
                  <td><strong>{g.name}</strong></td>
                  <td>{g.editorial}</td>
                  <td className="col-center">{g.players}</td>
                  <td className="col-center">{g.age}</td>
                  <td className="col-center">{g.time}</td>
                  {canAny && (
                    <td className="row-actions">
                      {canEdit && (
                        <button onClick={() => L.setEditing(g)} title="Editar">✎</button>
                      )}
                      {canDelete && (
                        <button onClick={() => L.handleDeleteGame(g)} title="Eliminar">×</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {L.filtered.length === 0 && (
                <tr>
                  <td colSpan={canAny ? 7 : 6} style={{ textAlign: "center", padding: "2rem" }}>
                    Cap joc trobat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {L.editing && (
        <GameEditModal
          game={L.editing === "new" ? null : L.editing}
          onSave={L.handleSaveGame}
          onCancel={() => L.setEditing(null)}
        />
      )}

      {L.diff && (
        <ImportDiffModal
          diff={L.diff}
          onApply={L.handleApplyDiff}
          onCancel={() => L.setDiff(null)}
        />
      )}
    </div>
  );
}
