import { bindings } from "@/lib/runtime";

export const dynamic = "force-dynamic";

type MediaProps = { params: Promise<{ key: string[] }> };

export async function GET(_: Request, { params }: MediaProps) {
  const runtime = bindings();
  if (!runtime.MEDIA || !runtime.DB) return new Response("Not found", { status: 404 });
  const { key: segments } = await params;
  const key = segments.join("/");
  if (!/^projects\/[A-Fa-f0-9-]{36}\.(?:jpg|png|webp|avif)$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const record = await runtime.DB
    .prepare("SELECT u.key FROM uploads u JOIN projects p ON p.image_url = '/api/media/' || u.key WHERE u.key = ? AND p.publication_status = 'published'")
    .bind(key)
    .first<{ key: string }>();
  if (!record) return new Response("Not found", { status: 404 });

  const object = await runtime.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
