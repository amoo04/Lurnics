import xss from "xss";

// Blog posts and store pages are business-authored HTML rendered directly
// (dangerouslySetInnerHTML) on the public, unauthenticated storefront - this
// strips script tags, event handlers, and other injectable markup before it
// ever reaches storage, so a malicious or compromised business account can't
// plant a stored-XSS payload against their own storefront's visitors.
export function sanitizeHtml(html: string): string {
  return xss(html);
}
