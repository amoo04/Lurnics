CREATE TABLE `growth_blueprint_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`website` text,
	`industry` text NOT NULL,
	`country` text NOT NULL,
	`employees` text NOT NULL,
	`revenue_range` text,
	`years_in_business` text,
	`business_model` text NOT NULL,
	`goals` text NOT NULL,
	`current_channels` text,
	`monthly_budget` text,
	`has_website` integer DEFAULT false NOT NULL,
	`has_landing_pages` integer DEFAULT false NOT NULL,
	`has_crm` integer DEFAULT false NOT NULL,
	`has_email_automation` integer DEFAULT false NOT NULL,
	`has_analytics` integer DEFAULT false NOT NULL,
	`challenges` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`blueprint` text,
	`generated_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `growth_blueprint_submissions_email_idx` ON `growth_blueprint_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `growth_blueprint_submissions_status_idx` ON `growth_blueprint_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `growth_blueprint_submissions_created_at_idx` ON `growth_blueprint_submissions` (`created_at`);