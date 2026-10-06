// Sends the enquiry form to your inbox using FormSubmit (no backend needed).
// Change the address with VITE_ENQUIRY_EMAIL in .env, or edit the fallback below.
export const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL || "jia3.harisinghani@gmail.com";

export async function sendEnquiry(d) {
  const res = await fetch(`https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      Name: d.name,
      Email: d.email,
      Phone: d.phone || "Not given",
      "Interested in": d.interest || "Not given",
      Message: d.message || "Not given",
      "Sent from page": location.href,
      "Sent at": new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      _subject: `New Aura enquiry from ${d.name}`,
      _replyto: d.email,
      _template: "table",
      _captcha: "false",
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !(json.success === true || json.success === "true")) {
    throw new Error(json.message || "Could not send");
  }

  // Optional: also post to your own API if you set VITE_API_URL (failure here is ignored)
  const api = import.meta.env.VITE_API_URL;
  if (api) {
    fetch(api + "/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }).catch(() => {});
  }
}
