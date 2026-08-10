import { bindings } from "@/lib/runtime";
import { services } from "@/content/site";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\s-]{8,20}$/;
const MAX_REQUESTS_PER_HOUR = 5;

type ContactPayload = {
  name?: unknown;
  organization?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function invalidRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function enforceRateLimit(request: Request): Promise<boolean> {
  const db = bindings().DB;
  if (!db) return true;

  const now = Date.now();
  const windowStart = Math.floor(now / 3_600_000) * 3_600_000;
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const id = await fingerprint(`${ip}:${windowStart}`);

  const current = await db
    .prepare("SELECT request_count FROM rate_limits WHERE id = ? AND expires_at > ?")
    .bind(id, now)
    .first<{ request_count: number }>();

  if ((current?.request_count ?? 0) >= MAX_REQUESTS_PER_HOUR) return false;

  await db
    .prepare(
      "INSERT INTO rate_limits (id, request_count, expires_at) VALUES (?, 1, ?) ON CONFLICT(id) DO UPDATE SET request_count = request_count + 1, expires_at = excluded.expires_at",
    )
    .bind(id, windowStart + 3_600_000)
    .run();

  return true;
}

async function sendEmail(values: Record<string, string>, inquiryId: string): Promise<boolean> {
  const runtime = bindings();
  if (!runtime.RESEND_API_KEY) return false;

  let recipient = runtime.CONTACT_TO_EMAIL ?? "";
  if (runtime.DB) {
    try {
      const stored = await runtime.DB
        .prepare("SELECT value FROM site_settings WHERE key = 'contactEmail'")
        .first<{ value: string }>();
      if (stored?.value && EMAIL_PATTERN.test(stored.value)) recipient = stored.value;
    } catch {
      // The environment fallback remains available before migrations are applied.
    }
  }
  if (!EMAIL_PATTERN.test(recipient)) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${runtime.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: runtime.CONTACT_FROM_EMAIL ?? "SELVA Website <onboarding@resend.dev>",
      to: [recipient],
      reply_to: values.email,
      subject: `[Website SELVA] Yêu cầu mới - ${values.service}`,
      text: [
        `Mã yêu cầu: ${inquiryId}`,
        `Họ tên: ${values.name}`,
        `Tổ chức: ${values.organization || "Không cung cấp"}`,
        `Email: ${values.email}`,
        `Điện thoại: ${values.phone || "Không cung cấp"}`,
        `Dịch vụ: ${values.service}`,
        "",
        values.message,
      ].join("\n"),
    }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Nguồn gửi không hợp lệ." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return invalidRequest("Định dạng yêu cầu không hợp lệ.");
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return invalidRequest("Dữ liệu gửi lên không hợp lệ.");
  }

  if (text(payload.website)) {
    return Response.json({ message: "SELVA đã tiếp nhận thông tin." });
  }

  const values = {
    name: text(payload.name),
    organization: text(payload.organization),
    email: text(payload.email).toLowerCase(),
    phone: text(payload.phone),
    service: text(payload.service),
    message: text(payload.message),
  };

  if (values.name.length < 2 || values.name.length > 100) return invalidRequest("Vui lòng nhập họ tên hợp lệ.");
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > 160) return invalidRequest("Vui lòng nhập email hợp lệ.");
  if (values.phone && !PHONE_PATTERN.test(values.phone)) return invalidRequest("Số điện thoại không hợp lệ.");
  const allowedServices = new Set([...services.map((service) => service.slug), "other"]);
  if (!allowedServices.has(values.service)) return invalidRequest("Vui lòng chọn dịch vụ quan tâm hợp lệ.");
  if (values.message.length < 20 || values.message.length > 3000) return invalidRequest("Mô tả nhu cầu cần từ 20 đến 3000 ký tự.");
  if (values.organization.length > 120) return invalidRequest("Tên tổ chức quá dài.");
  if (payload.consent !== "yes") return invalidRequest("Bạn cần đồng ý với mục đích xử lý thông tin.");

  try {
    if (!(await enforceRateLimit(request))) {
      return Response.json(
        { error: "Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau." },
        { status: 429, headers: { "retry-after": "3600" } },
      );
    }
  } catch {
    return Response.json({ error: "Hệ thống chống spam đang tạm gián đoạn. Vui lòng thử lại sau." }, { status: 503 });
  }

  const db = bindings().DB;
  const inquiryId = crypto.randomUUID();
  let stored = false;

  if (db) {
    try {
      await db
        .prepare(
          "INSERT INTO inquiries (id, name, organization, email, phone, service, message, status, email_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', 'pending', ?)",
        )
        .bind(
          inquiryId,
          values.name,
          values.organization || null,
          values.email,
          values.phone || null,
          values.service,
          values.message,
          Date.now(),
        )
        .run();
      stored = true;
    } catch {
      stored = false;
    }
  }

  let emailed = false;
  try {
    emailed = await sendEmail(values, inquiryId);
  } catch {
    emailed = false;
  }

  if (stored && db) {
    await db
      .prepare("UPDATE inquiries SET email_status = ? WHERE id = ?")
      .bind(emailed ? "sent" : "pending", inquiryId)
      .run();
  }

  if (!stored && !emailed) {
    return Response.json(
      { error: "Kênh tiếp nhận đang tạm gián đoạn. Vui lòng email trực tiếp cho SELVA." },
      { status: 503 },
    );
  }

  return Response.json({
    message: emailed
      ? "Yêu cầu đã được gửi. SELVA sẽ phản hồi trong thời gian sớm nhất."
      : "Yêu cầu đã được lưu an toàn. SELVA sẽ kiểm tra và phản hồi sớm.",
  });
}
