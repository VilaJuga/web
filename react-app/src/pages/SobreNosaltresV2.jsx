import { useSiteData } from "../context/SiteDataContext";
import { EditableText, EditableImage } from "../components/Editable";

export default function SobreNosaltresV2() {
  const { data } = useSiteData();
  const { title, sectionTitle, paragraphs, membres, image } = data.about;

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">Qui som</span>
        <EditableText path="about.title" value={title} tag="h1" className="v2-page-title" />
        <div className="v2-section-divider" />
      </header>

      <section className="v2-about-layout">
        <div className="v2-about-text">
          <EditableText
            path="about.sectionTitle"
            value={sectionTitle}
            tag="h2"
            className="v2-subsection-title left"
          />
          {paragraphs.map((text, i) => (
            <EditableText
              key={i}
              path={`about.paragraphs.${i}`}
              value={text}
              tag="p"
              className="v2-about-paragraph"
            >
              {text.includes("*Juguem!*") ? (
                <>
                  {text.split("*Juguem!*")[0]}
                  <em>Juguem!</em>
                  {text.split("*Juguem!*")[1]}
                </>
              ) : (
                text
              )}
            </EditableText>
          ))}

          <div className="v2-team-section">
            <h3 className="v2-team-heading">L'equip</h3>
            <ul className="v2-team-list">
              {membres.map((membre, i) => (
                <EditableText
                  key={i}
                  path={`about.membres.${i}`}
                  value={membre}
                  tag="li"
                  className="v2-team-item"
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="v2-about-image-wrap">
          <EditableImage
            path="about.logo.src"
            src={image.src}
            alt={image.alt}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
