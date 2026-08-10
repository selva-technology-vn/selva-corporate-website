import { services } from "@/content/site";

export const dynamic = "force-dynamic";

const routes = ["", "about", "services", "projects", "process", "contact", "privacy"];

function xml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const allRoutes = [...routes, ...services.map((service) => `services/${service.slug}`)];
  const lastmod = "2026-08-10";
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes
    .map((route) => `  <url><loc>${xml(`${origin}/${route}`)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join("\n")}\n</urlset>`;
  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
