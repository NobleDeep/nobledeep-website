/*
  Contact form delivery. Validates the submission and emails it through
  Resend's REST API, with Reply-To set to the sender so a reply in your
  mail client goes straight back to them.

  Environment (set in Vercel → Project → Settings → Environment Variables,
  and in .env.local for local testing):
    RESEND_API_KEY      required
    CONTACT_TO_EMAIL    optional, defaults to andrew@nobledeepsea.com
    CONTACT_FROM_EMAIL  optional, defaults to Resend's test sender, which
                        only delivers to the Resend account's own address.
                        After verifying nobledeepsea.com in Resend, set it
                        to e.g. "Noble Deep Website <website@nobledeepsea.com>".
*/

const LIMITS = { name: 120, email: 200, company: 160, role: 160, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = Record<keyof typeof LIMITS, string>;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Strips line breaks so user input can't add headers to the subject line */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const f = {} as Fields;
  for (const key of Object.keys(LIMITS) as (keyof Fields)[]) {
    const v = body[key];
    f[key] = typeof v === "string" ? v.trim().slice(0, LIMITS[key]) : "";
  }
  if (!f.name || !f.message || !EMAIL_RE.test(f.email)) {
    return Response.json({ error: "Please fill in your name, a valid email, and a message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; submission not delivered.");
    return Response.json({ error: "Form delivery is not configured." }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "andrew@nobledeepsea.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Noble Deep Website <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Company", f.company || "—"],
    ["Role", f.role || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${f.message}\n`;
  const html = `
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#667">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(f.message)}</p>
  `;

  const subjectWho = oneLine(f.company ? `${f.name} (${f.company})` : f.name);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: f.email,
        subject: `Website inquiry from ${subjectWho}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return Response.json({ error: "Message could not be sent." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return Response.json({ error: "Message could not be sent." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
