CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`status` text DEFAULT 'active' NOT NULL,
	`tags` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_business_email_idx` ON `customers` (`business_id`,`email`);--> statement-breakpoint
CREATE INDEX `customers_status_idx` ON `customers` (`status`);