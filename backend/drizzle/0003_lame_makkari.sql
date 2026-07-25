CREATE TABLE `calculator_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`mode` text NOT NULL,
	`currency` text NOT NULL,
	`hours_per_week` real NOT NULL,
	`inquiries_per_week` real NOT NULL,
	`cold_percent` real NOT NULL,
	`order_value` real NOT NULL,
	`hourly_value` real NOT NULL,
	`monthly_time_cost` real NOT NULL,
	`monthly_revenue_lost` real NOT NULL,
	`total_monthly_cost` real NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `calculator_submissions_email_idx` ON `calculator_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `calculator_submissions_created_at_idx` ON `calculator_submissions` (`created_at`);