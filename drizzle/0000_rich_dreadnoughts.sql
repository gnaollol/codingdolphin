CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`module_id` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_visitor_created` ON `attempts` (`visitor_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`cache_key` text NOT NULL,
	`question` text NOT NULL,
	`title` text NOT NULL,
	`language` text NOT NULL,
	`style` text NOT NULL,
	`depth` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_modules_cache_key` ON `modules` (`cache_key`);--> statement-breakpoint
CREATE INDEX `idx_modules_title` ON `modules` (`title`);