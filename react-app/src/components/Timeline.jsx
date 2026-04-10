import { EditableText } from "./Editable";

export default function Timeline({ items }) {
  return (
    <section className="timeline-section">
      <div className="container">
        <h2>Què s'hi inclou?</h2>
        <div className="divider center" />
        <div style={{ display: "grid", gap: "1.5rem", marginTop: "1rem" }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              {item.side === "left" ? (
                <>
                  <div style={{ textAlign: "right" }}>
                    <EditableText path={`timelineItems.${i}.label`} value={item.label} tag="strong" />
                    <br />
                    <EditableText path={`timelineItems.${i}.subLabel`} value={item.subLabel} tag="small" style={{ color: "#888" }} />
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff" }}>
                    <i className={item.iconClass} />
                  </div>
                  <div>
                    <EditableText path={`timelineItems.${i}.title`} value={item.title} tag="strong" />
                    <EditableText path={`timelineItems.${i}.description`} value={item.description} tag="p" style={{ margin: "0.3rem 0 0", fontSize: "0.9rem", color: "#555" }} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: "right" }}>
                    <EditableText path={`timelineItems.${i}.title`} value={item.title} tag="strong" />
                    <EditableText path={`timelineItems.${i}.description`} value={item.description} tag="p" style={{ margin: "0.3rem 0 0", fontSize: "0.9rem", color: "#555" }} />
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff" }}>
                    <i className={item.iconClass} />
                  </div>
                  <div>
                    <EditableText path={`timelineItems.${i}.label`} value={item.label} tag="strong" />
                    <br />
                    <EditableText path={`timelineItems.${i}.subLabel`} value={item.subLabel} tag="small" style={{ color: "#888" }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
