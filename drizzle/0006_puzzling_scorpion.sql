CREATE TABLE `coding_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`problem_slug` text NOT NULL,
	`language` text NOT NULL,
	`code` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_coding_drafts_user_problem_language` ON `coding_drafts` (`user_id`,`problem_slug`,`language`);--> statement-breakpoint
CREATE TABLE `coding_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`problem_slug` text NOT NULL,
	`language` text NOT NULL,
	`code` text NOT NULL,
	`passed` integer NOT NULL,
	`total` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_coding_submissions_user_problem_language_date` ON `coding_submissions` (`user_id`,`problem_slug`,`language`,`created_at`);