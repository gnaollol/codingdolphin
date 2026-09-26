ALTER TABLE `attempts` ADD `user_id` text REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `idx_attempts_user_created` ON `attempts` (`user_id`,`created_at`);