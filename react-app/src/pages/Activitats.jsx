import { useSiteData } from "../context/SiteDataContext";
import { EditableText, EditableImage } from "../components/Editable";
import { AddButton, DeleteButton } from "../components/AdminControls";
import { useAuth } from "../context/AuthContext";

export default function Activitats() {
  const { data, addTorneig, removeTorneig } = useSiteData();
  const { isAdmin } = useAuth();
  const { title, sectionTitle, torneigs } = data.activitats;

  return (
    <div className="page-container">
      <EditableText path="activitats.title" value={title} tag="h1" />
      <div className="divider center" />

      <EditableText
        path="activitats.sectionTitle"
        value={sectionTitle}
        tag="h2"
        style={{ textAlign: "center", fontSize: "2rem" }}
      />

      {torneigs.map((torneig, i) => (
        <div key={i} className="torneig-card admin-item-wrap">
          <DeleteButton onClick={() => removeTorneig(i)} />
          <div className="torneig-info">
            <EditableText path={`activitats.torneigs.${i}.title`} value={torneig.title} tag="h2" />
            <p><strong>Data:</strong> <EditableText path={`activitats.torneigs.${i}.data`} value={torneig.data} /></p>
            <p><strong>Horari:</strong> <EditableText path={`activitats.torneigs.${i}.horari`} value={torneig.horari} /></p>
            <p><strong>Ubicació:</strong> <EditableText path={`activitats.torneigs.${i}.ubicacio`} value={torneig.ubicacio} /></p>
            {(torneig.notes || []).map((note, j) => (
              <EditableText key={j} path={`activitats.torneigs.${i}.notes.${j}`} value={note} tag="p" />
            ))}
            {torneig.inscripcioUrl && (
              <a
                className="btn-primary"
                href={torneig.inscripcioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {torneig.inscripcioText}
              </a>
            )}
          </div>
          <EditableImage
            path={`activitats.torneigs.${i}.src`}
            src={torneig.image?.src}
            alt={torneig.image?.alt}
            loading="lazy"
          />
        </div>
      ))}

      {isAdmin && (
        <div className="admin-add-btn-wrap">
          <AddButton label="Afegir torneig" onClick={addTorneig} />
        </div>
      )}
    </div>
  );
}
