import { bindings } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const indexable = bindings().PUBLIC_INDEXING === "true";
  const body = indexable
    ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
