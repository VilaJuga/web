import { useSiteData } from "../context/SiteDataContext";
import { EditableText } from "../components/Editable";
import ContactForm from "../components/ContactForm";

const DEFAULT_FORM = {
  title: "Envia'ns un missatge",
  nameLabel: "Nom",
  emailLabel: "Correu electrònic",
  phoneLabel: "Telèfon (opcional)",
  messageLabel: "Missatge",
  submitLabel: "Enviar",
  successMessage: "Missatge enviat correctament. Et contactarem aviat!",
  errorMessage: "Hi ha hagut un error. Torna-ho a provar més tard.",
};

export default function ContacteV2() {
  const { data } = useSiteData();
  const { title, sections, instagram } = data.contacte;
  const form = data.contacte.form || DEFAULT_FORM;
  const adminEmail = data.contacte.adminEmail || "holavilajuga@gmail.com";

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">Parlem</span>
        <EditableText path="contacte.title" value={title} tag="h1" className="v2-page-title" />
        <div className="v2-section-divider" />
      </header>

      <section className="v2-contact-grid">
        <div className="v2-contact-info">
          {sections.map((section, i) => (
            <div key={i} className="v2-contact-block">
              <EditableText
                path={`contacte.sections.${i}.heading`}
                value={section.heading}
                tag="h2"
                className="v2-contact-heading"
              />
              {section.paragraphs.map((text, j) => (
                <EditableText
                  key={j}
                  path={`contacte.sections.${i}.paragraphs.${j}`}
                  value={text}
                  tag="p"
                  className="v2-contact-paragraph"
                >
                  {text.includes("**")
                    ? text
                        .split("**")
                        .map((part, k) =>
                          k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                        )
                    : text}
                </EditableText>
              ))}
            </div>
          ))}

          <a
            className="v2-instagram-card"
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram" aria-hidden="true" />
            <div>
              <span className="v2-ig-kicker">Segueix-nos a</span>
              <strong>{instagram.text}</strong>
            </div>
            <span className="v2-ig-arrow">→</span>
          </a>
        </div>

        <div className="v2-contact-form-wrap">
          <ContactForm form={form} adminEmail={adminEmail} />
        </div>
      </section>
    </div>
  );
}
