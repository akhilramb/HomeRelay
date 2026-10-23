CREATE TABLE `invitations` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`user_id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`member_id` text NOT NULL
);
