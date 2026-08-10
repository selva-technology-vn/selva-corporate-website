import { bindings, isSameOriginRequest, requireAdminApi } from "@/lib/runtime";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Nguồn gửi không hợp lệ." }, { status: 403 });
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const runtime = bindings();
  if (!runtime.MEDIA || !runtime.DB) {
    return Response.json({ error: "Kho ảnh chưa được cấu hình." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Vui lòng chọn một tệp ảnh." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return Response.json({ error: "Chỉ chấp nhận JPG, PNG, WebP hoặc AVIF." }, { status: 415 });
  if (file.size < 1 || file.size > MAX_BYTES) return Response.json({ error: "Ảnh phải nhỏ hơn hoặc bằng 5 MB." }, { status: 413 });

  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
  const key = `projects/${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  const header = new Uint8Array(bytes.slice(0, 16));
  const ascii = String.fromCharCode(...header);
  const detected =
    header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff ? "image/jpeg" :
      header.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]) ? "image/png" :
        ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP" ? "image/webp" :
          ascii.slice(4, 8) === "ftyp" && /(?:avif|avis|mif1)/.test(ascii.slice(8, 16)) ? "image/avif" : null;
  if (detected !== file.type) {
    return Response.json({ error: "Nội dung tệp không khớp định dạng ảnh đã khai báo." }, { status: 415 });
  }

  await runtime.MEDIA.put(key, bytes, { httpMetadata: { contentType: file.type } });
  try {
    await runtime.DB
      .prepare("INSERT INTO uploads (key, content_type, byte_size, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(key, file.type, file.size, auth.user.email, Date.now())
      .run();
  } catch (error) {
    await runtime.MEDIA.delete(key);
    throw error;
  }

  return Response.json({ url: `/api/media/${key}` });
}
