import "dotenv/config";
import { ARTICLES, CASE_STUDIES, INDUSTRIES, SOLUTIONS } from "./seed-content.js";

const API_URL = process.argv[2] ?? "http://localhost:3001";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in backend/.env");
}

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const json = (await res.json()) as { success: boolean; data?: any; error?: { message: string } };
  return { ok: res.ok && json.success, status: res.status, json, res };
}

async function main() {
  console.log(`Publishing content to ${API_URL}`);

  const login = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`Login failed: ${JSON.stringify(login.json)}`);
  const setCookie = login.res.headers.get("set-cookie");
  const token = setCookie?.match(/access_token=([^;]+)/)?.[1];
  if (!token) throw new Error("Login succeeded but no access_token cookie was returned");
  const authHeaders = { Authorization: `Bearer ${token}` };

  for (const industry of INDUSTRIES) {
    const res = await api("/api/industries", { method: "POST", headers: authHeaders, body: JSON.stringify(industry) });
    console.log(res.ok ? `Created industry: ${industry.name}` : `Industry "${industry.name}": ${res.json.error?.message ?? res.status}`);
  }

  for (const solution of SOLUTIONS) {
    const res = await api("/api/solutions", { method: "POST", headers: authHeaders, body: JSON.stringify(solution) });
    console.log(res.ok ? `Created solution: ${solution.name}` : `Solution "${solution.name}": ${res.json.error?.message ?? res.status}`);
  }

  const industriesRes = await api("/api/industries?limit=100");
  const industryIdBySlug = new Map<string, string>(
    (industriesRes.json.data?.items ?? []).map((i: { slug: string; id: string }) => [i.slug, i.id]),
  );

  for (const { industrySlug, ...cs } of CASE_STUDIES) {
    const body = { ...cs, industryId: industryIdBySlug.get(industrySlug), published: true };
    const res = await api("/api/case-studies", { method: "POST", headers: authHeaders, body: JSON.stringify(body) });
    if (res.ok) {
      console.log(`Created success story: ${cs.title}`);
      continue;
    }
    if (res.status === 409) {
      const listRes = await api("/api/case-studies/admin?limit=100", { headers: authHeaders });
      const existing = (listRes.json.data?.items ?? []).find((c: { slug: string }) => c.slug === cs.slug);
      if (existing) {
        const patchRes = await api(`/api/case-studies/${existing.id}`, {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify(body),
        });
        console.log(patchRes.ok ? `Updated success story: ${cs.title}` : `Success story "${cs.title}" update failed: ${patchRes.json.error?.message}`);
        continue;
      }
    }
    console.log(`Success story "${cs.title}": ${res.json.error?.message ?? res.status}`);
  }

  for (const article of ARTICLES) {
    const body = { ...article, status: "published" };
    const res = await api("/api/articles", { method: "POST", headers: authHeaders, body: JSON.stringify(body) });
    console.log(res.ok ? `Published article: ${article.title}` : `Article "${article.title}": ${res.json.error?.message ?? res.status}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
