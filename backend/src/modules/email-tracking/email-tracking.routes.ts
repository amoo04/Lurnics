import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import {
  findSendByToken,
  findSendWithCampaignByToken,
  markClicked,
  markOpened,
  optOutCustomer,
} from "./email-tracking.repository.js";

export const emailTrackingRoutes = new Hono<AppEnv>();

// 1x1 transparent GIF, decoded once at module load.
const PIXEL = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7"),
  (c) => c.charCodeAt(0),
);

emailTrackingRoutes.get("/open/:token", async (c) => {
  await markOpened(c.req.param("token"));
  return c.body(PIXEL, 200, { "Content-Type": "image/gif", "Cache-Control": "no-store" });
});

emailTrackingRoutes.get("/click/:token", async (c) => {
  // The redirect target always comes from the campaign's own stored ctaUrl,
  // never from the request - a client-supplied `url` query param would let
  // anyone holding a valid token (i.e. anyone who received one legitimate
  // email) redirect through our domain to an arbitrary destination.
  const send = await findSendWithCampaignByToken(c.req.param("token"));
  const target = send?.campaign?.ctaUrl;

  await markClicked(c.req.param("token"));

  if (!send || !target) {
    return c.text("Link not found", 404);
  }

  return c.redirect(target, 302);
});

emailTrackingRoutes.get("/unsubscribe/:token", async (c) => {
  const send = await findSendByToken(c.req.param("token"));
  if (!send) return c.text("Link not found", 404);

  await optOutCustomer(send.businessId, send.customerEmail);

  return c.html(
    "<html><body style=\"font-family:sans-serif;padding:40px;text-align:center;\">" +
      "<p>You've been unsubscribed and won't receive further marketing emails.</p></body></html>",
  );
});
