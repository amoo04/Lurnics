CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text DEFAULT '' NOT NULL,
	`cover_image_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_business_slug_idx` ON `blog_posts` (`business_id`,`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`status`);--> statement-breakpoint
CREATE TABLE `nav_menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`location` text DEFAULT 'main' NOT NULL,
	`label` text NOT NULL,
	`link_type` text DEFAULT 'custom' NOT NULL,
	`target_slug` text,
	`custom_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `nav_menu_items_business_location_idx` ON `nav_menu_items` (`business_id`,`location`);