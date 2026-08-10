CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organization` text,
	`email` text NOT NULL,
	`phone` text,
	`service` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`industry` text NOT NULL,
	`problem` text NOT NULL,
	`scope` text NOT NULL,
	`solution` text NOT NULL,
	`result` text NOT NULL,
	`technologies` text NOT NULL,
	`image_url` text,
	`live_url` text,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`request_count` integer DEFAULT 1 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`short_title` text NOT NULL,
	`summary` text NOT NULL,
	`problem` text NOT NULL,
	`capabilities` text NOT NULL,
	`deliverables` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`key` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` integer NOT NULL
);
