CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`type` text DEFAULT 'page' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_business_slug_idx` ON `pages` (`business_id`,`slug`);--> statement-breakpoint
CREATE INDEX `pages_status_idx` ON `pages` (`status`);