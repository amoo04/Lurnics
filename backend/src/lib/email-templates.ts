const BRAND = {
  orange: "#f97316",
  gray900: "#111827",
  gray600: "#4b5563",
  gray400: "#9ca3af",
  gray200: "#e5e7eb",
  gray50: "#f9fafb",
};

export interface EmailLayoutInput {
  preheader?: string;
  eyebrow?: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function paragraphsToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 12px 0;">${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

// Table-based layout with inline styles only, kept deliberately simple, so it
// renders consistently across email clients (Outlook/Gmail strip <style>
// blocks and flexbox/grid support is unreliable).
export function renderEmailLayout({
  preheader,
  eyebrow,
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: EmailLayoutInput): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lurnics</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.gray50};font-family:Arial,Helvetica,sans-serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.gray50};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BRAND.gray200};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <span style="font-size:18px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;color:${BRAND.gray900};">Lurnics</span>
                <div style="margin-top:6px;height:3px;width:28px;background-color:${BRAND.orange};"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                ${
                  eyebrow
                    ? `<p style="margin:0 0 8px 0;font-size:11px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;color:${BRAND.orange};">${eyebrow}</p>`
                    : ""
                }
                <h1 style="margin:0;font-size:20px;line-height:1.4;color:${BRAND.gray900};">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 8px 32px;font-size:14px;line-height:1.7;color:${BRAND.gray600};">
                ${bodyHtml}
              </td>
            </tr>
            ${
              ctaLabel && ctaUrl
                ? `<tr>
              <td style="padding:16px 32px 8px 32px;">
                <a href="${ctaUrl}" style="display:inline-block;background-color:${BRAND.gray900};color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 24px;border-radius:6px;">${ctaLabel}</a>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:28px 32px 28px 32px;border-top:1px solid ${BRAND.gray200};margin-top:20px;">
                <p style="margin:20px 0 0 0;font-size:12px;color:${BRAND.gray400};">
                  Lurnics &middot; Custom Software & Automation Studio<br />
                  ${footerNote ?? "This email was sent because of an inquiry submitted on lurnics.com."}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export interface LeadConfirmationInput {
  contactPerson: string;
  companyName: string;
  service?: string | null;
}

export function leadConfirmationEmail({ contactPerson, companyName, service }: LeadConfirmationInput) {
  const firstName = contactPerson.trim().split(/\s+/)[0] || contactPerson;
  const subject = "We've received your inquiry, Lurnics";
  const text = `Hi ${firstName},\n\nThanks for reaching out to Lurnics${service ? ` about ${service}` : ""}. We've received your inquiry for ${companyName} and our team will get back to you within 1-2 business days.\n\nIn the meantime, feel free to reply to this email if you have anything to add.\n\nLurnics\nCustom Software & Automation Studio`;

  // contactPerson/companyName/service come straight from the public lead
  // form - fully untrusted input, so every value here must be escaped
  // before it's interpolated into the HTML (unlike the internal-only
  // templates below).
  const safeFirstName = escapeHtml(firstName);
  const safeCompanyName = escapeHtml(companyName);
  const safeService = service ? escapeHtml(service) : null;

  const html = renderEmailLayout({
    preheader: "Thanks for reaching out, we'll be in touch shortly.",
    heading: `Thanks for reaching out, ${safeFirstName}.`,
    bodyHtml: `
      <p style="margin:0 0 12px 0;">
        We've received your inquiry${safeService ? ` about <strong>${safeService}</strong>` : ""} for
        <strong>${safeCompanyName}</strong>. Our team is reviewing the details and will get back to you
        within 1-2 business days.
      </p>
      <p style="margin:0;">
        If there's anything else you'd like to add before then, just reply directly to this email.
      </p>
    `,
  });

  return { subject, text, html };
}

export interface LeadReplyInput {
  contactPerson?: string;
  body: string;
}

export function leadReplyEmail({ contactPerson, body }: LeadReplyInput) {
  const firstName = contactPerson?.trim().split(/\s+/)[0] || "there";

  const html = renderEmailLayout({
    heading: `Hi ${firstName},`,
    bodyHtml: paragraphsToHtml(body),
  });

  return { html };
}

export type ClientEmailType = "newsletter" | "pitch" | "update" | "custom";

const CLIENT_EMAIL_EYEBROW: Record<ClientEmailType, string | undefined> = {
  newsletter: "Lurnics Newsletter",
  pitch: "A Proposal From Lurnics",
  update: "Project Update",
  custom: undefined,
};

export interface ClientMessageInput {
  type: ClientEmailType;
  contactPerson?: string;
  subject: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function clientMessageEmail({ type, contactPerson, subject, body, ctaLabel, ctaUrl }: ClientMessageInput) {
  const firstName = contactPerson?.trim().split(/\s+/)[0] || "there";

  const html = renderEmailLayout({
    eyebrow: CLIENT_EMAIL_EYEBROW[type],
    heading: `Hi ${firstName},`,
    bodyHtml: paragraphsToHtml(body),
    ctaLabel,
    ctaUrl,
    footerNote: "You're receiving this because Lurnics is working with your business.",
  });

  return { subject, text: body, html };
}

export interface MaintenanceReminderInput {
  contactPerson: string;
  companyName: string;
  planType: string;
  amount: number;
  currencySymbol?: string;
  expiryDate: string;
  daysUntil: number;
}

export function maintenanceReminderEmail({
  contactPerson,
  companyName,
  planType,
  amount,
  currencySymbol = "₦",
  expiryDate,
  daysUntil,
}: MaintenanceReminderInput) {
  const firstName = contactPerson.trim().split(/\s+/)[0] || contactPerson;
  const formattedAmount = `${currencySymbol}${amount.toLocaleString()}`;
  const formattedDate = new Date(expiryDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timing =
    daysUntil <= 0
      ? "is due today"
      : daysUntil === 1
        ? "is due tomorrow"
        : `renews in ${daysUntil} days`;

  const subject =
    daysUntil <= 0
      ? `Your Lurnics maintenance plan is due today`
      : `Reminder: your Lurnics maintenance plan renews in ${daysUntil} days`;

  const text = `Hi ${firstName},\n\nThis is a reminder that the ${planType} maintenance plan for ${companyName} ${timing} (${formattedDate}), amount due: ${formattedAmount}.\n\nReply to this email or reach out to arrange payment and keep your systems covered without interruption.\n\nLurnics\nCustom Software & Automation Studio`;

  const html = renderEmailLayout({
    preheader: `Your maintenance plan ${timing}.`,
    eyebrow: "Maintenance Reminder",
    heading: `Hi ${firstName}, your maintenance plan ${timing}.`,
    bodyHtml: `
      <p style="margin:0 0 12px 0;">
        The <strong>${planType}</strong> maintenance plan for <strong>${companyName}</strong>
        ${timing} on <strong>${formattedDate}</strong>. Amount due: <strong>${formattedAmount}</strong>.
      </p>
      <p style="margin:0;">
        Reply to this email or reach out to your Lurnics contact to arrange payment and keep your
        systems covered without interruption.
      </p>
    `,
    footerNote: "You're receiving this because your business has an active maintenance plan with Lurnics.",
  });

  return { subject, text, html };
}

export interface MaintenanceReminderDigestItem {
  companyName: string;
  planType: string;
  amount: number;
  currencySymbol?: string;
  expiryDate: string;
  daysUntil: number;
}

// Internal digest sent to Lurnics itself (info@lurnics.com), since
// Cloudflare's Send Email binding can't reach clients' own addresses -
// this is the admin's cue to follow up with each client manually.
export function maintenanceReminderDigestEmail(items: MaintenanceReminderDigestItem[]) {
  const subject =
    items.length === 1
      ? `Maintenance renewal due: ${items[0].companyName}`
      : `${items.length} maintenance renewals coming up`;

  const rows = items
    .map(({ companyName, planType, amount, currencySymbol = "₦", expiryDate, daysUntil }) => {
      const formattedAmount = `${currencySymbol}${amount.toLocaleString()}`;
      const formattedDate = new Date(expiryDate).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timing = daysUntil <= 0 ? "due today" : daysUntil === 1 ? "due tomorrow" : `due in ${daysUntil} days`;
      return `<li style="margin:0 0 10px 0;"><strong>${companyName}</strong>, ${planType}, ${formattedAmount}, ${timing} (${formattedDate})</li>`;
    })
    .join("");

  const text = items
    .map(
      ({ companyName, planType, amount, currencySymbol = "₦", expiryDate, daysUntil }) =>
        `${companyName}, ${planType}, ${currencySymbol}${amount.toLocaleString()}, due ${expiryDate} (${daysUntil} days)`,
    )
    .join("\n");

  const html = renderEmailLayout({
    eyebrow: "Maintenance Reminder",
    heading: subject,
    bodyHtml: `
      <p style="margin:0 0 12px 0;">The following maintenance plans need a renewal follow-up:</p>
      <ul style="margin:0;padding-left:18px;">${rows}</ul>
    `,
    footerNote: "Reach out to each client directly, this is an internal reminder only.",
  });

  return { subject, text, html };
}
