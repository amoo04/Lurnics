CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `collections_business_id_idx` ON `collections` (`business_id`);--> statement-breakpoint
CREATE INDEX `collections_status_idx` ON `collections` (`status`);--> statement-breakpoint
CREATE TABLE `product_collections` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`collection_id` text NOT NULL,
	`product_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_collections_collection_product_idx` ON `product_collections` (`collection_id`,`product_id`);--> statement-breakpoint
CREATE INDEX `product_collections_product_id_idx` ON `product_collections` (`product_id`);