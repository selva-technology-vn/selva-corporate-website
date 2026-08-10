import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const services = sqliteTable(
  "services",
  {
    slug: text("slug").primaryKey(),
    title: text("title").notNull(),
    shortTitle: text("short_title").notNull(),
    summary: text("summary").notNull(),
    problem: text("problem").notNull(),
    capabilities: text("capabilities").notNull(),
    deliverables: text("deliverables").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_services_published_order").on(table.published, table.displayOrder)],
);

export const projects = sqliteTable("projects", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  industry: text("industry").notNull(),
  problem: text("problem").notNull(),
  scope: text("scope").notNull(),
  solution: text("solution").notNull(),
  result: text("result").notNull(),
  technologies: text("technologies").notNull(),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  publicationStatus: text("publication_status").notNull().default("draft"),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_projects_status_order").on(table.publicationStatus, table.displayOrder)]);

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organization: text("organization"),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  emailStatus: text("email_status").notNull().default("pending"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_inquiries_status_created").on(table.status, table.createdAt)]);

export const rateLimits = sqliteTable("rate_limits", {
  id: text("id").primaryKey(),
  requestCount: integer("request_count").notNull().default(1),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [index("idx_rate_limits_expires").on(table.expiresAt)]);

export const uploads = sqliteTable("uploads", {
  key: text("key").primaryKey(),
  contentType: text("content_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: integer("created_at").notNull(),
});
