CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`amount` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`imageKey` varchar(512),
	`imageUrl` varchar(1024),
	`createdAt` bigint NOT NULL,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
