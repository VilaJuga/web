// EmailJS integration (client-side email sending, no backend required).
// To enable real email sending:
//   1. Create a free account at https://www.emailjs.com/
//   2. Add an email service (Gmail, Outlook, SMTP...) and note the SERVICE_ID
//   3. Create an email template with variables: {{from_name}}, {{from_email}}, {{phone}}, {{message}}, {{to_email}}
//   4. Note the TEMPLATE_ID and your PUBLIC_KEY
//   5. Copy .env.example to .env and fill in the values
//   6. Restart the dev server
//
// If env vars are missing, the form will still save to Firestore but no email will be sent.

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function isEmailConfigured() {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendContactEmail({ name, email, phone, message, toEmail }) {
  if (!isEmailConfigured()) {
    console.warn("EmailJS not configured. Skipping email send.");
    return { sent: false, reason: "not-configured" };
  }

  const body = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      from_name: name,
      from_email: email,
      phone: phone || "—",
      message,
      to_email: toEmail,
    },
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("EmailJS error: " + text);
  }

  return { sent: true };
}
