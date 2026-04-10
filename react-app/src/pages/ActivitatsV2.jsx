import { useSiteData } from "../context/SiteDataContext";
import { useAuth } from "../context/AuthContext";
import { EditableText, EditableImage } from "../components/Editable";
import { AddButton, DeleteButton } from "../components/AdminControls";

export default function ActivitatsV2() {
  const { data, addTorneig, removeTorneig } = useSiteData();
  const { isAdmin } = useAuth();
  const { title, sectionTitle, torneigs } = data.activitats;

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">Calendari</span>
        <EditableText path="activitats.title" value={title} tag="h1" className="v2-page-title" />
        <div className="v2-section-divider" />
      </header>

      <section className="v2-page-body">
        <EditableText
          path="activitats.sectionTitle"
          value={sectionTitle}
          tag="h2"
          className="v2-subsection-title"
        />

        <div className="v2-torneigs">
          {torneigs.map((torneig, i) => (
            <article key={i} className="v2-torneig-card admin-item-wrap">
              <DeleteButton onClick={() => removeTorneig(i)} />
              <div className="v2-torneig-img-wrap">
                <EditableImage
                  path={`activitats.torneigs.${i}.src`}
                  src={torneig.image?.src}
                  alt={torneig.image?.alt}
                  loading="lazy"
                />
                <div className="v2-torneig-tag">#{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div className="v2-torneig-body">
                <EditableText
                  path={`activitats.torneigs.${i}.title`}
                  value={torneig.title}
                  tag="h3"
                  className="v2-torneig-title"
                />
                <div className="v2-torneig-meta">
                  <div className="v2-meta-item">
                    <i className="fas fa-calendar" aria-hidden="true" />
                    <span>
                      <EditableText path={`activitats.torneigs.${i}.data`} value={torneig.data} />
                    </span>
                  </div>
                  <div className="v2-meta-item">
                    <i className="fas fa-clock" aria-hidden="true" />
                    <span>
                      <EditableText path={`activitats.torneigs.${i}.horari`} value={torneig.horari} />
                    </span>
                  </div>
                  <div className="v2-meta-item">
                    <i className="fas fa-map-marker-alt" aria-hidden="true" />
                    <span>
                      <EditableText path={`activitats.torneigs.${i}.ubicacio`} value={torneig.ubicacio} />
                    </span>
                  </div>
                </div>

                {(torneig.notes || []).length > 0 && (
                  <div className="v2-torneig-notes">
                    {torneig.notes.map((note, j) => (
                      <EditableText
                        key={j}
                        path={`activitats.torneigs.${i}.notes.${j}`}
                        value={note}
                        tag="p"
                      />
                    ))}
                  </div>
                )}

                {torneig.inscripcioUrl && (
                  <a
                    className="v2-btn v2-btn-primary"
                    href={torneig.inscripcioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {torneig.inscripcioText} →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {isAdmin && (
          <div className="admin-add-btn-wrap">
            <AddButton label="Afegir torneig" onClick={addTorneig} />
          </div>
        )}
      </section>
    </div>
  );
}
