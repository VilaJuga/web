import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";
import { EditableText } from "../components/Editable";
import GameEditModal from "../components/GameEditModal";
import ImportDiffModal from "../components/ImportDiffModal";
import { useLudoteca } from "../hooks/useLudoteca";

export default function LudotecaV2() {
  const { data } = useSiteData();
  const { can } = useAuth();
  const canAdd = can("juegos", "añadir");
  const canEdit = can("juegos", "modificar");
  const canDelete = can("juegos", "eliminar");
  const canAny = canAdd || canEdit || canDelete;
  const { title, description, sheetId, searchPlaceholder } = data.ludoteca;

  const L = useLudoteca(sheetId);

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">Jocs disponibles</span>
        <EditableText path="ludoteca.title" value={title} tag="h1" className="v2-page-title" />
        <div className="v2-section-divider" />
        <EditableText path="ludoteca.description" value={description} tag="p" className="v2-page-desc" />
      </header>

      <section className="v2-ludoteca">
        <div className="v2-ludoteca-toolbar">
          <div className="v2-ludoteca-search-wrap">
            <i className="fas fa-search" aria-hidden="true" />
            <input
              type="search"
              value={L.search}
              onChange={(e) => L.setSearch(e.target.value)}
              placeholder={searchPlaceholder || "Cerca..."}
            />
          </div>

          <div className="v2-ludoteca-counter">
            <span className="v2-count-num">{L.filtered.length}</span>
            <span className="v2-count-label">de {L.games.length} jocs</span>
          </div>

          {L.hasActiveColumnFilters && (
            <button className="v2-btn v2-btn-ghost-dark" onClick={L.clearColumnFilters}>
              Netejar filtres
            </button>
          )}

          <div className="v2-ludoteca-actions">
            <button className="v2-btn v2-btn-ghost-dark" onClick={L.handleExportCsv}>
              Exportar CSV
            </button>
            {canAdd && (
              <>
                <button
                  className="v2-btn v2-btn-ghost-dark"
                  onClick={L.handleImportClick}
                  disabled={L.importing}
                >
                  {L.importing ? "Important..." : "Importar full"}
                </button>
                <button className="v2-btn v2-btn-primary" onClick={() => L.setEditing("new")}>
                  + Nou joc
                </button>
              </>
            )}
          </div>
        </div>

        {L.importError && <p className="v2-form-error">{L.importError}</p>}

        {L.loading ? (
          <p className="v2-loading">Carregant jocs...</p>
        ) : (
          <div className="v2-ludoteca-table-wrap">
            <table className="v2-ludoteca-table">
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
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <input
                      type="number"
                      value={L.columnFilters.players}
                      onChange={(e) => L.setColumnFilter("players", e.target.value.slice(0, 2))}
                      placeholder="3"
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
                      placeholder="10"
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
                    <td>
                      <strong>{g.name}</strong>
                    </td>
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
      </section>

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
