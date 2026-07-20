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
}

// Cloudflare's Send Email binding (`env.SEB`) only exists inside the
// Workers runtime - there is no equivalent HTTP API to call it from plain
// Node. When running locally via `pnpm dev` (Node), SEB is undefined, so we
// log the email instead of sending it rather than breaking lead-capture /
// draft-email flows in local dev. Real sending only happens via
// `wrangler dev` or a deployed Worker, where SEB is present.
export async function sendEmail({ from, to, subject, text }: SendEmailInput): Promise<{ id: string }> {
  const { SEB } = getBindings();

  if (!SEB) {
    console.log(`[email:dev-noop] from=${from} to=${to} subject=${JSON.stringify(subject)}\n${text}`);
    return { id: "dev-noop" };
  }

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

  const message = new EmailMessage(from, to, msg.asRaw());

  try {
    await SEB.send(message);
  } catch (err) {
    throw new AppError(err instanceof Error ? err.message : "Failed to send email", 502, "EMAIL_SEND_FAILED");
  }

  return { id: crypto.randomUUID() };
}
