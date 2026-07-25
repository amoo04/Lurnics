CREATE TABLE `requirements_generator_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`company_name` text,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`project_type` text NOT NULL,
	`goal` text NOT NULL,
	`must_have_features` text NOT NULL,
	`nice_to_have_features` text,
	`target_users` text,
	`timeline` text NOT NULL,
	`budget_range` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `requirements_generator_submissions_email_idx` ON `requirements_generator_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `requirements_generator_submissions_created_at_idx` ON `requirements_generator_submissions` (`created_at`);--> statement-breakpoint
CREATE TABLE `software_cost_estimator_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text,
	`company_name` text,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`project_type` text NOT NULL,
	`platforms` text NOT NULL,
	`features` text NOT NULL,
	`needs_design` integer DEFAULT false NOT NULL,
	`timeline` text NOT NULL,
	`budget_range` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `software_cost_estimator_submissions_email_idx` ON `software_cost_estimator_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `software_cost_estimator_submissions_created_at_idx` ON `software_cost_estimator_submissions` (`created_at`);