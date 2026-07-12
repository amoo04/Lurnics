import { Resend } from "resend";

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@lurnics.com";
export const LEADS_EMAIL_FROM = process.env.LEADS_EMAIL_FROM ?? "pitch@lurnics.com";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}
