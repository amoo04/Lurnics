CREATE TABLE `discounts` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'code' NOT NULL,
	`discount_type` text DEFAULT 'percentage' NOT NULL,
	`value` real,
	`applies_to` text DEFAULT 'entire_order' NOT NULL,
	`min_order_amount` real,
	`usage_limit` integer,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discounts_business_code_idx` ON `discounts` (`business_id`,`code`);--> statement-breakpoint
CREATE INDEX `discounts_type_idx` ON `discounts` (`type`);--> statement-breakpoint
CREATE TABLE `gift_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`code` text NOT NULL,
	`type` text DEFAULT 'digital' NOT NULL,
	`initial_value` real NOT NULL,
	`balance` real NOT NULL,
	`recipient_name` text,
	`recipient_email` text,
	`message` text,
	`activates_at` text,
	`expires_at` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gift_cards_business_code_idx` ON `gift_cards` (`business_id`,`code`);