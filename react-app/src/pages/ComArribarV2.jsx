import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { EditableText } from "../components/Editable";

// Map transport label keywords to Font Awesome icons
function iconForLabel(label = "") {
  const l = label.toLowerCase();
  if (l.includes("vehicle") || l.includes("cotxe") || l.includes("coche")) return "fas fa-car";
  if (l.includes("tren")) return "fas fa-train";
  if (l.includes("urbà") || l.includes("urbano")) return "fas fa-bus-alt";
  if (l.includes("bus")) return "fas fa-bus";
  return "fas fa-route";
}

export default function ComArribarV2() {
  const { data } = useSiteData();
  const { title, address, mapUrl, transport } = data.comArribar;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">Ubicació</span>
        <EditableText path="comArribar.title" value={title} tag="h1" className="v2-page-title" />
        <div className="v2-section-divider" />
      </header>

      <section className="v2-page-body">
        <div className="v2-address-card">
          <i className="fas fa-map-marker-alt" aria-hidden="true" />
          <div>
            <span className="v2-address-kicker">Adreça</span>
            <EditableText path="comArribar.address" value={address} tag="strong" />
          </div>
        </div>

        <div className="v2-transport">
          <div className="v2-transport-tabs">
            {transport.map((tab, i) => (
              <button
                key={i}
                className={`v2-transport-tab${i === activeTab ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                <i className={iconForLabel(tab.label)} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="v2-transport-content">
            {transport[activeTab].paragraphs.map((text, i) => (
              <EditableText
                key={i}
                path={`comArribar.transport.${activeTab}.paragraphs.${i}`}
                value={text}
                tag="p"
              />
            ))}
          </div>
        </div>

        <div className="v2-map-wrap">
          <iframe
            src={mapUrl}
            title={`Ubicació - ${title}`}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}
