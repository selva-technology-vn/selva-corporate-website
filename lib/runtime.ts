import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

let platformEnv: unknown = {};
try {
  platformEnv = (await import("cloudflare:workers")).env;
} catch {
  platformEnv = typeof process !== "undefined" ? process.env : {};
}

type D1Result<T = Record<string, unknown>> = {
  results?: T[];
  success: boolean;
};

export type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  run: () => Promise<D1Result>;
};

export type D1Database = {
  prepare: (query: string) => D1Statement;
  batch: (statements: D1Statement[]) => Promise<D1Result[]>;
};

export type R2ObjectBody = {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
};

export type R2Bucket = {
  get: (key: string) => Promise<R2ObjectBody | null>;
  put: (
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
  delete: (key: string) => Promise<void>;
};

type RuntimeBindings = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  ADMIN_EMAILS?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  PUBLIC_INDEXING?: string;
  ADMIN_ENABLED?: string;
};

export function bindings(): RuntimeBindings {
  return platformEnv as RuntimeBindings;
}

export function getAdminEmails(): string[] {
  return (bindings().ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function getAuthorizedAdmin(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  if (!user) return null;

  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return null;
  return allowlist.includes(user.email.toLowerCase()) ? user : null;
}

export async function requireAdminApi(): Promise<
  { ok: true; user: ChatGPTUser } | { ok: false; response: Response }
> {
  const user = await getAuthorizedAdmin();
  if (!user) {
    return {
      ok: false,
      response: Response.json(
        { error: "Bạn không có quyền thực hiện thao tác này." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, user };
}
