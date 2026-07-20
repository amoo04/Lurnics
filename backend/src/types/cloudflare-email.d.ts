// "cloudflare:email" is a built-in module that only exists inside the
// Cloudflare Workers runtime (not resolvable via node_modules). This
// declaration lets `import("cloudflare:email")` type-check without pulling
// in the full @cloudflare/workers-types ambient global surface.
declare module "cloudflare:email" {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
  }
}
