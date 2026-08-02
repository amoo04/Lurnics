import { getBindings } from "./env.js";
import { AppError } from "../middleware/error.js";

export function emailFrom(): string {
  return getBindings().EMAIL_FROM;
}

export function leadsEmailFrom(): string {
  return getBindings().LEADS_EMAIL_FROM;
}

export interface SendEmailInput {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ id: string }> {
  const { RESEND_API_KEY, SEB } = getBindings();

  if (RESEND_API_KEY) {
    return sendViaResend(input, RESEND_API_KEY);
  }

  if (!SEB) {
    console.log(`[email:dev-noop] from=${input.from} to=${input.to} subject=${JSON.stringify(input.subject)}\n${input.text}`);
    return { id: "dev-noop" };
  }

  return sendViaCloudflare(input, SEB);
}

// Resend's plain HTTP API - works identically on Node and Workers, unlike
// the Cloudflare Send Email binding, it can deliver to any recipient once
// the sending domain is verified with Resend (not just a pre-verified
// destination address), which is what leads/clients actually need.
async function sendViaResend({ from, to, subject, text, html }: SendEmailInput, apiKey: string): Promise<{ id: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new AppError(`Failed to send email: ${body}`, 502, "EMAIL_SEND_FAILED");
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}

// Cloudflare's Send Email binding (`env.SEB`) only exists inside the
// Workers runtime, and can only deliver to addresses verified as a
// "Destination Address" in Email Routing for the zone - kept as a fallback
// for local/dev environments that don't have RESEND_API_KEY configured.
async function sendViaCloudflare(
  { from, to, subject, text, html }: SendEmailInput,
  seb: NonNullable<ReturnType<typeof getBindings>["SEB"]>,
): Promise<{ id: string }> {
  // The Workers runtime doesn't have Node's built-ins, so the browser-safe
  // build of mimetext is required here (the default/node entry point would
  // reach for APIs that don't exist on Workers).
  const { createMimeMessage } = await import("mimetext/browser");
  const { EmailMessage } = await import("cloudflare:email");

  const msg = createMimeMessage();
  msg.setSender(from);
  msg.setRecipient(to);
  msg.setSubject(subject);
  msg.addMessage({ contentType: "text/plain", data: text });
  if (html) {
    msg.addMessage({ contentType: "text/html", data: html });
  }

  const message = new EmailMessage(from, to, msg.asRaw());

  try {
    await seb.send(message);
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Failed to send email";
    const message = /not allowed/i.test(raw)
      ? `Cloudflare can only deliver email to verified destination addresses (currently ${emailFrom()}). To send to other recipients, connect a transactional email provider.`
      : raw;
    throw new AppError(message, 502, "EMAIL_SEND_FAILED");
  }

  return { id: crypto.randomUUID() };
}
