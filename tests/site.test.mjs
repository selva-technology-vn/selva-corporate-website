import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const runtime = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

async function fetchSite(path, init) {
  return worker.fetch(new Request(`http://localhost${path}`, init), runtime, context);
}

test("renders every public route with approved content and no starter residue", async () => {
  const routes = [
    "/",
    "/about",
    "/services",
    "/services/web-portal",
    "/services/lms-elearning",
    "/services/custom-software",
    "/services/maintenance-support",
    "/services/it-consulting",
    "/projects",
    "/process",
    "/contact",
    "/privacy",
  ];

  for (const route of routes) {
    const response = await fetchSite(route, { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    const html = await response.text();
    assert.match(html, /<html[^>]+lang="vi"/i, route);
    assert.match(html, /<title>[^<]*SELVA[^<]*<\/title>/i, route);
    assert.match(html, /SELVA/, route);
    assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview|lorem ipsum/i, route);
    assert.doesNotMatch(html, /MST:\s*(TBD|000)|số 1|hàng đầu/i, route);
  }
});

test("keeps unapproved legal and client information out of rendered pages", async () => {
  const [home, projects] = await Promise.all([
    fetchSite("/", { headers: { accept: "text/html" } }).then((response) => response.text()),
    fetchSite("/projects", { headers: { accept: "text/html" } }).then((response) => response.text()),
  ]);

  for (const html of [home, projects]) {
    assert.doesNotMatch(html, /CÔNG TY TNHH CÔNG NGHỆ SELVA/);
    assert.doesNotMatch(html, /96 Cao Thắng/);
    assert.doesNotMatch(html, /ĐHQG|Đại học Quốc gia/i);
  }
  assert.match(projects, /Chưa có case study công khai/);
});

test("serves staging-safe robots, sitemap and a real 404", async () => {
  const [robotsResponse, sitemapResponse, missingResponse] = await Promise.all([
    fetchSite("/robots.txt"),
    fetchSite("/sitemap.xml"),
    fetchSite("/khong-ton-tai", { headers: { accept: "text/html" } }),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Disallow: \/\s*$/m);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>http:\/\/localhost\/services\/web-portal<\/loc>/);
  assert.equal(missingResponse.status, 404);
  assert.match(await missingResponse.text(), /Trang bạn tìm không tồn tại/);
});

test("contact endpoint rejects invalid and cross-origin requests", async () => {
  const invalid = await fetchSite("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "A", email: "bad", consent: "no" }),
  });
  assert.equal(invalid.status, 400);

  const crossOrigin = await fetchSite("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://attacker.example" },
    body: JSON.stringify({}),
  });
  assert.equal(crossOrigin.status, 403);

  const bot = await fetchSite("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ website: "spam.example" }),
  });
  assert.equal(bot.status, 200);
});

test("repository contains no committed environment file or obvious secret", async () => {
  const rootFiles = await readdir(new URL("../", import.meta.url));
  assert.equal(rootFiles.some((file) => /^\.env(?!\.example$)/.test(file)), false);

  const sourceFiles = [
    "app/api/contact/route.ts",
    "app/api/admin/content/route.ts",
    "lib/runtime.ts",
  ];
  for (const relative of sourceFiles) {
    const source = await readFile(new URL(`../${relative}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /(?:sk|re|pk)_(?:live|test)_[A-Za-z0-9]{16,}/);
  }
});

test("Cloudflare production profile has D1 and no metered R2 binding", async () => {
  const raw = await readFile(new URL("../wrangler.production.jsonc", import.meta.url), "utf8");
  const config = JSON.parse(raw);

  assert.equal(config.vars.ADMIN_ENABLED, "false");
  assert.equal(config.vars.PUBLIC_INDEXING, "false");
  assert.equal(config.d1_databases?.[0]?.binding, "DB");
  assert.equal(config.d1_databases?.[0]?.database_name, "selva-website-production");
  assert.deepEqual(config.rules?.[0]?.globs, ["**/*.js", "**/*.mjs"]);
  assert.equal("r2_buckets" in config, false);
});
