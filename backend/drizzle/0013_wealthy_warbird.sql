CREATE TABLE `store_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`content` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `store_sections_business_type_idx` ON `store_sections` (`business_id`,`type`);--> statement-breakpoint
CREATE INDEX `store_sections_business_id_idx` ON `store_sections` (`business_id`);--> statement-breakpoint
ALTER TABLE `collections` ADD `slug` text;--> statement-breakpoint
CREATE UNIQUE INDEX `collections_business_slug_idx` ON `collections` (`business_id`,`slug`);