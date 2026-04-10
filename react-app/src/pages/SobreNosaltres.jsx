import { useSiteData } from "../context/SiteDataContext";
import { EditableText, EditableImage } from "../components/Editable";

export default function SobreNosaltres() {
  const { data } = useSiteData();
  const { title, sectionTitle, paragraphs, membres, image } = data.about;

  return (
    <div className="page-container">
      <EditableText path="about.title" value={title} tag="h1" />
      <div className="divider center" />

      <div className="about-grid">
        <div>
          <EditableText path="about.sectionTitle" value={sectionTitle} tag="h2" style={{ textAlign: "left" }} />
          {paragraphs.map((text, i) => (
            <EditableText key={i} path={`about.paragraphs.${i}`} value={text} tag="p">
              {text.includes("*Juguem!*")
                ? <>{text.split("*Juguem!*")[0]}<em>Juguem!</em>{text.split("*Juguem!*")[1]}</>
                : text
              }
            </EditableText>
          ))}
          <ul>
            {membres.map((membre, i) => (
              <EditableText key={i} path={`about.membres.${i}`} value={membre} tag="li" />
            ))}
          </ul>
        </div>
        <EditableImage
          path="about.logo.src"
          src={image.src}
          alt={image.alt}
          loading="lazy"
        />
      </div>
    </div>
  );
}
