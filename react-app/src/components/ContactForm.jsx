import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { sendContactEmail, isEmailConfigured } from "../services/sendContactEmail";
import { EditableText } from "./Editable";

export default function ContactForm({ form, adminEmail }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  function validate() {
    if (!name.trim()) return "El nom és obligatori";
    if (!email.trim()) return "El correu és obligatori";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "El correu no és vàlid";
    if (!message.trim()) return "El missatge és obligatori";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus("error");
      setErrorMsg(err);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      // 1. Always save to Firestore as a record
      await addDoc(collection(db, "messages"), {
        name,
        email,
        phone: phone || null,
        message,
        toEmail: adminEmail,
        createdAt: serverTimestamp(),
      });

      // 2. Try to send real email via EmailJS if configured
      if (isEmailConfigured()) {
        await sendContactEmail({ name, email, phone, message, toEmail: adminEmail });
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMsg(err.message || form.errorMessage);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <EditableText path="contacte.form.title" value={form.title} tag="h3" />

      <label>
        <EditableText path="contacte.form.nameLabel" value={form.nameLabel} />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={status === "sending"}
        />
      </label>

      <label>
        <EditableText path="contacte.form.emailLabel" value={form.emailLabel} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "sending"}
        />
      </label>

      <label>
        <EditableText path="contacte.form.phoneLabel" value={form.phoneLabel} />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === "sending"}
        />
      </label>

      <label>
        <EditableText path="contacte.form.messageLabel" value={form.messageLabel} />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          disabled={status === "sending"}
        />
      </label>

      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Enviant..." : form.submitLabel}
      </button>

      {status === "success" && (
        <p className="form-feedback success">{form.successMessage}</p>
      )}
      {status === "error" && (
        <p className="form-feedback error">{errorMsg || form.errorMessage}</p>
      )}
    </form>
  );
}
