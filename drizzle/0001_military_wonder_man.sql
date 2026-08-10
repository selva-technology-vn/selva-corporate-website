CREATE INDEX `idx_inquiries_status_created` ON `inquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_projects_status_order` ON `projects` (`publication_status`,`display_order`);--> statement-breakpoint
CREATE INDEX `idx_rate_limits_expires` ON `rate_limits` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_services_published_order` ON `services` (`published`,`display_order`);