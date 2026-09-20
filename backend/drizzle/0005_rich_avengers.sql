CREATE TABLE `business_members` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `platform_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_members_business_user_idx` ON `business_members` (`business_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `business_members_user_id_idx` ON `business_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `businesses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`custom_domain` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`logo` text,
	`currency` text DEFAULT 'USD' NOT NULL,
	`timezone` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_slug_unique` ON `businesses` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_slug_idx` ON `businesses` (`slug`);--> statement-breakpoint
CREATE INDEX `businesses_status_idx` ON `businesses` (`status`);--> statement-breakpoint
CREATE TABLE `platform_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`is_email_verified` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_users_email_unique` ON `platform_users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_users_email_idx` ON `platform_users` (`email`);