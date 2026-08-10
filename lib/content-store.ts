import {
  defaultSettings,
  publicProjects,
  services as defaultServices,
  type Project,
  type Service,
  type SiteSettings,
} from "@/content/site";
import { bindings, type D1Database } from "@/lib/runtime";

export type PublicContent = {
  settings: SiteSettings;
  services: Service[];
  projects: Project[];
};

type ServiceRow = {
  slug: string;
  title: string;
  short_title: string;
  summary: string;
  problem: string;
  capabilities: string;
  deliverables: string;
  display_order: number;
  published: number;
};

type ProjectRow = {
  slug: string;
  title: string;
  industry: string;
  problem: string;
  scope: string;
  solution: string;
  result: string;
  technologies: string;
  image_url: string | null;
  live_url: string | null;
  publication_status: "draft" | "published";
};

function stringList(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function httpsLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([label, url]) =>
        /^[A-Za-zÀ-ỹ0-9 ._-]{1,40}$/.test(label) &&
        typeof url === "string" &&
        /^https:\/\//i.test(url),
      )
      .map(([label, url]) => [label, String(url)]),
  );
}

function mapService(row: ServiceRow): Service {
  const fallback = defaultServices.find((item) => item.slug === row.slug);
  return {
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title || fallback?.shortTitle || row.title,
    summary: row.summary,
    problem: row.problem,
    capabilities: stringList(row.capabilities),
    deliverables: stringList(row.deliverables),
    accent: fallback?.accent ?? String(row.display_order + 1).padStart(2, "0"),
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    industry: row.industry,
    problem: row.problem,
    scope: row.scope,
    solution: row.solution,
    result: row.result,
    technologies: stringList(row.technologies),
    imageUrl: row.image_url ?? undefined,
    liveUrl: row.live_url ?? undefined,
    publicationStatus: row.publication_status,
  };
}

function mergeServices(rows: ServiceRow[]): Service[] {
  const overrides = new Map(rows.map((row) => [row.slug, mapService(row)]));
  const confirmed = defaultServices.map((service) => overrides.get(service.slug) ?? service);
  const custom = rows
    .filter((row) => !defaultServices.some((service) => service.slug === row.slug))
    .map(mapService);
  return [...confirmed, ...custom];
}

async function readSettings(db: D1Database): Promise<SiteSettings> {
  const result = await db
    .prepare("SELECT key, value FROM site_settings")
    .all<{ key: string; value: string }>();
  const values = Object.fromEntries(
    (result.results ?? []).map(({ key, value }) => [key, value]),
  );

  const socialLinks = values.socialLinks
    ? httpsLinks(JSON.parse(values.socialLinks) as unknown)
    : defaultSettings.socialLinks;

  return {
    ...defaultSettings,
    ...values,
    legalDetailsApproved: values.legalDetailsApproved === "true",
    socialLinks,
  };
}

export async function getPublicContent(): Promise<PublicContent> {
  const db = bindings().DB;
  if (!db) {
    return {
      settings: defaultSettings,
      services: defaultServices,
      projects: publicProjects,
    };
  }

  try {
    const [settings, serviceRows, projectRows] = await Promise.all([
      readSettings(db),
      db
        .prepare(
          "SELECT slug, title, short_title, summary, problem, capabilities, deliverables, display_order, published FROM services WHERE published = 1 ORDER BY display_order ASC, slug ASC",
        )
        .all<ServiceRow>(),
      db
        .prepare(
          "SELECT slug, title, industry, problem, scope, solution, result, technologies, image_url, live_url, publication_status FROM projects WHERE publication_status = 'published' ORDER BY display_order ASC, updated_at DESC",
        )
        .all<ProjectRow>(),
    ]);

    return {
      settings,
      services: mergeServices(serviceRows.results ?? []),
      projects: (projectRows.results ?? []).map(mapProject),
    };
  } catch {
    return {
      settings: defaultSettings,
      services: defaultServices,
      projects: publicProjects,
    };
  }
}

export async function getAdminContent(): Promise<PublicContent> {
  const db = bindings().DB;
  if (!db) return getPublicContent();

  try {
    const [settings, serviceRows, projectRows] = await Promise.all([
      readSettings(db),
      db
        .prepare(
          "SELECT slug, title, short_title, summary, problem, capabilities, deliverables, display_order, published FROM services ORDER BY display_order ASC, slug ASC",
        )
        .all<ServiceRow>(),
      db
        .prepare(
          "SELECT slug, title, industry, problem, scope, solution, result, technologies, image_url, live_url, publication_status FROM projects ORDER BY display_order ASC, updated_at DESC",
        )
        .all<ProjectRow>(),
    ]);

    return {
      settings,
      services: mergeServices(serviceRows.results ?? []),
      projects: (projectRows.results ?? []).map(mapProject),
    };
  } catch {
    return getPublicContent();
  }
}
