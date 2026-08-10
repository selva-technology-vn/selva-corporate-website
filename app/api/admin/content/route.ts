import { getAdminContent } from "@/lib/content-store";
import { bindings, isSameOriginRequest, requireAdminApi } from "@/lib/runtime";
import { services as confirmedServices } from "@/content/site";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 3000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => clean(item, 240)).filter(Boolean).slice(0, 20)
    : [];
}

function validSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validAssetPath(value: string): boolean {
  return !value || /^\/(?:brand\/|api\/media\/)[A-Za-z0-9._/-]+$/.test(value);
}

function safeSocialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([label, url]) =>
        /^[A-Za-zÀ-ỹ0-9 ._-]{1,40}$/.test(label) &&
        typeof url === "string" &&
        (!url || /^https:\/\//i.test(url)),
      )
      .map(([label, url]) => [label, String(url)]),
  );
}

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  return Response.json(await getAdminContent());
}

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Nguồn gửi không hợp lệ." }, { status: 403 });
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const db = bindings().DB;
  if (!db) return Response.json({ error: "Database chưa được cấu hình." }, { status: 503 });

  let body: { type?: unknown; data?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const type = clean(body.type, 40);
  const data = body.data ?? {};
  const now = Date.now();

  if (type === "settings") {
    const contactEmail = clean(data.contactEmail, 160).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return Response.json({ error: "Email liên hệ không hợp lệ." }, { status: 400 });
    }
    if (!clean(data.heroTitle, 160) || !clean(data.heroCopy, 1000) || !clean(data.seoTitle, 300) || !clean(data.seoDescription, 1000)) {
      return Response.json({ error: "Hero và thông tin SEO không được để trống." }, { status: 400 });
    }
    if (data.legalDetailsApproved === true && (!clean(data.legalName, 300) || !clean(data.officeAddress, 300))) {
      return Response.json({ error: "Cần nhập tên pháp lý và địa chỉ trước khi bật công khai pháp lý." }, { status: 400 });
    }
    const allowedKeys = [
      "heroTitle", "heroCopy", "contactEmail", "contactPhone", "officeAddress",
      "legalName", "taxId", "legalDetailsApproved", "seoTitle", "seoDescription",
      "logoUrl", "footerLogoUrl", "ogImageUrl", "socialLinks",
    ] as const;
    const statements = allowedKeys.map((key) => {
      const raw = data[key];
      const value = key === "socialLinks"
        ? JSON.stringify(safeSocialLinks(raw))
        : key === "legalDetailsApproved"
          ? String(raw === true)
          : clean(raw, key.includes("Copy") || key.includes("Description") ? 1000 : 300);

      if (["logoUrl", "footerLogoUrl", "ogImageUrl"].includes(key) && !validAssetPath(value)) {
        throw new Error(`Đường dẫn ${key} không hợp lệ.`);
      }
      return db
        .prepare("INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
        .bind(key, value, now);
    });

    try {
      await db.batch(statements);
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Không thể lưu cấu hình." }, { status: 400 });
    }
    return Response.json({ message: "Đã lưu cấu hình website." });
  }

  if (type === "service") {
    const slug = clean(data.slug, 80);
    if (!validSlug(slug) || !confirmedServices.some((service) => service.slug === slug)) return Response.json({ error: "Dịch vụ không thuộc phạm vi launch đã xác nhận." }, { status: 400 });
    if (!clean(data.title, 160) || !clean(data.shortTitle, 120) || !clean(data.summary, 500) || !clean(data.problem, 1000)) {
      return Response.json({ error: "Các trường nội dung chính của dịch vụ không được để trống." }, { status: 400 });
    }
    await db
      .prepare(
        "INSERT INTO services (slug, title, short_title, summary, problem, capabilities, deliverables, display_order, published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET title = excluded.title, short_title = excluded.short_title, summary = excluded.summary, problem = excluded.problem, capabilities = excluded.capabilities, deliverables = excluded.deliverables, display_order = excluded.display_order, published = excluded.published, updated_at = excluded.updated_at",
      )
      .bind(
        slug,
        clean(data.title, 160),
        clean(data.shortTitle, 120),
        clean(data.summary, 500),
        clean(data.problem, 1000),
        JSON.stringify(cleanList(data.capabilities)),
        JSON.stringify(cleanList(data.deliverables)),
        Number.isFinite(Number(data.displayOrder)) ? Number(data.displayOrder) : 0,
        data.published === false ? 0 : 1,
        now,
      )
      .run();
    return Response.json({ message: "Đã lưu dịch vụ." });
  }

  if (type === "project") {
    const slug = clean(data.slug, 80);
    const imageUrl = clean(data.imageUrl, 500);
    const liveUrl = clean(data.liveUrl, 500);
    if (!validSlug(slug)) return Response.json({ error: "Slug dự án không hợp lệ." }, { status: 400 });
    if (![data.title, data.industry, data.problem, data.scope, data.solution, data.result].every((value) => Boolean(clean(value)))) {
      return Response.json({ error: "Vui lòng điền đủ tên, ngành, bài toán, phạm vi, giải pháp và kết quả." }, { status: 400 });
    }
    if (!validAssetPath(imageUrl)) return Response.json({ error: "Đường dẫn ảnh không hợp lệ." }, { status: 400 });
    if (liveUrl && !/^https:\/\//i.test(liveUrl)) return Response.json({ error: "Live URL phải dùng HTTPS." }, { status: 400 });
    const status = data.publicationStatus === "published" ? "published" : "draft";
    const previous = await db.prepare("SELECT image_url FROM projects WHERE slug = ?").bind(slug).first<{ image_url: string | null }>();
    await db
      .prepare(
        "INSERT INTO projects (slug, title, industry, problem, scope, solution, result, technologies, image_url, live_url, publication_status, display_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET title = excluded.title, industry = excluded.industry, problem = excluded.problem, scope = excluded.scope, solution = excluded.solution, result = excluded.result, technologies = excluded.technologies, image_url = excluded.image_url, live_url = excluded.live_url, publication_status = excluded.publication_status, display_order = excluded.display_order, updated_at = excluded.updated_at",
      )
      .bind(
        slug,
        clean(data.title, 180),
        clean(data.industry, 160),
        clean(data.problem),
        clean(data.scope),
        clean(data.solution),
        clean(data.result),
        JSON.stringify(cleanList(data.technologies)),
        imageUrl || null,
        liveUrl || null,
        status,
        Number.isFinite(Number(data.displayOrder)) ? Number(data.displayOrder) : 0,
        now,
      )
      .run();
    if (previous?.image_url && previous.image_url !== imageUrl && previous.image_url.startsWith("/api/media/") && bindings().MEDIA) {
      const oldKey = previous.image_url.slice("/api/media/".length);
      await bindings().MEDIA?.delete(oldKey);
      await db.prepare("DELETE FROM uploads WHERE key = ?").bind(oldKey).run();
    }
    return Response.json({ message: status === "published" ? "Đã lưu và công khai dự án." : "Đã lưu dự án ở trạng thái nháp." });
  }

  if (type === "deleteProject") {
    const slug = clean(data.slug, 80);
    if (!validSlug(slug)) return Response.json({ error: "Slug dự án không hợp lệ." }, { status: 400 });
    const project = await db.prepare("SELECT image_url FROM projects WHERE slug = ?").bind(slug).first<{ image_url: string | null }>();
    await db.prepare("DELETE FROM projects WHERE slug = ?").bind(slug).run();
    if (project?.image_url?.startsWith("/api/media/") && bindings().MEDIA) {
      const key = project.image_url.slice("/api/media/".length);
      await bindings().MEDIA?.delete(key);
      await db.prepare("DELETE FROM uploads WHERE key = ?").bind(key).run();
    }
    return Response.json({ message: "Đã xóa dự án." });
  }

  return Response.json({ error: "Loại cập nhật không được hỗ trợ." }, { status: 400 });
}
