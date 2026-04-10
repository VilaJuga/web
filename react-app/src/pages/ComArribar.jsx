import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { EditableText } from "../components/Editable";

export default function ComArribar() {
  const { data } = useSiteData();
  const { title, address, mapUrl, transport } = data.comArribar;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page-container">
      <EditableText path="comArribar.title" value={title} tag="h1" />
      <div className="divider center" />

      <p style={{ textAlign: "center" }}>
        <strong>Adreça:</strong>{" "}
        <EditableText path="comArribar.address" value={address} />
      </p>

      <div className="transport-tabs">
        <div className="tab-buttons">
          {transport.map((tab, i) => (
            <button
              key={i}
              className={`tab-btn${i === activeTab ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
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

      <div className="map-container">
        <iframe
          src={mapUrl}
          title={`Ubicació - ${title}`}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
