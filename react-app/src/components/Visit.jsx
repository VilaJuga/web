import { EditableText } from "./Editable";

export default function Visit({ visit }) {
  return (
    <section
      className="visit section-gap"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${visit.backgroundImage}") center/cover no-repeat`,
      }}
    >
      <div className="container visit-content">
        <EditableText path="visit.title" value={visit.title} tag="h2" />
        <EditableText path="visit.address" value={visit.address} tag="p" />
      </div>
    </section>
  );
}
