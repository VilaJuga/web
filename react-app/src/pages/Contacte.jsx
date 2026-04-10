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

export default function Contacte() {
  const { data } = useSiteData();
  const { title, sections, instagram } = data.contacte;
  const form = data.contacte.form || DEFAULT_FORM;
  const adminEmail = data.contacte.adminEmail || "holavilajuga@gmail.com";

  return (
    <div className="page-container">
      <EditableText path="contacte.title" value={title} tag="h1" />
      <div className="divider center" />

      {sections.map((section, i) => (
        <div key={i}>
          <EditableText path={`contacte.sections.${i}.heading`} value={section.heading} tag="h2" />
          {section.paragraphs.map((text, j) => (
            <EditableText key={j} path={`contacte.sections.${i}.paragraphs.${j}`} value={text} tag="p">
              {text.includes("**")
                ? text.split("**").map((part, k) =>
                    k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                  )
                : text
              }
            </EditableText>
          ))}
        </div>
      ))}

      <a
        className="btn-instagram"
        href={instagram.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-instagram" /> {instagram.text}
      </a>

      {form && <ContactForm form={form} adminEmail={adminEmail} />}
    </div>
  );
}
