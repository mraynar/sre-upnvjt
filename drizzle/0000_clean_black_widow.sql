CREATE TABLE `_TaskRoles` (
	`A` int NOT NULL,
	`B` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Activity` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(1000),
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Article` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`thumbnailUrl` varchar(1000),
	`isPublished` boolean NOT NULL DEFAULT false,
	`authorId` int NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Article_id` PRIMARY KEY(`id`),
	CONSTRAINT `Article_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Attendance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int NOT NULL,
	`status` varchar(50) NOT NULL,
	`proofUrl` varchar(1000),
	`date` datetime NOT NULL,
	CONSTRAINT `Attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `AttendanceSession` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`date` datetime NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdById` int NOT NULL,
	`projectId` int,
	CONSTRAINT `AttendanceSession_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Committee` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`role` varchar(255) NOT NULL,
	CONSTRAINT `Committee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Department` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(255) NOT NULL,
	CONSTRAINT `Department_id` PRIMARY KEY(`id`),
	CONSTRAINT `Department_name_unique` UNIQUE(`name`),
	CONSTRAINT `Department_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `Division` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`departmentId` int NOT NULL,
	CONSTRAINT `Division_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Document` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'OTHER',
	`description` text,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Finance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`type` enum('INCOME','EXPENSE') NOT NULL,
	`proofUrl` varchar(1000),
	`date` datetime NOT NULL,
	`loggedById` int NOT NULL,
	`projectId` int,
	CONSTRAINT `Finance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Inventory` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(255),
	`category` varchar(255) NOT NULL DEFAULT 'GENERAL',
	`quantity` int NOT NULL DEFAULT 1,
	`condition` varchar(50) NOT NULL DEFAULT 'GOOD',
	`location` varchar(255),
	`isAvailable` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `InventoryLoan` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`userId` int NOT NULL,
	`quantity` int NOT NULL,
	`status` enum('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL DEFAULT 'PENDING',
	`borrowDate` datetime NOT NULL,
	`returnDate` datetime,
	CONSTRAINT `InventoryLoan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Merchandise` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(1000),
	`linkUrl` varchar(1000),
	`isAvailable` boolean NOT NULL DEFAULT true,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Merchandise_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Notification` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`linkUrl` varchar(1000),
	`createdAt` datetime NOT NULL,
	CONSTRAINT `Notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Partner` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`size` varchar(50) NOT NULL DEFAULT 'MEDIUM',
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Partner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Project` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`departmentId` int NOT NULL,
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`status` enum('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL DEFAULT 'PENDING',
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Project_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Role` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`permissions` json NOT NULL,
	CONSTRAINT `Role_id` PRIMARY KEY(`id`),
	CONSTRAINT `Role_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Task` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`departmentId` int NOT NULL,
	`assignedById` int NOT NULL,
	`deadline` datetime NOT NULL,
	`status` enum('TODO','IN_PROGRESS','DONE','OVERDUE') NOT NULL DEFAULT 'TODO',
	`requireWeeklyReport` boolean NOT NULL DEFAULT false,
	`finalResult` text,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `Task_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `TaskReport` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`reportText` text NOT NULL,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `TaskReport_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`npm` varchar(255),
	`positionName` varchar(255),
	`profilePictureUrl` varchar(500),
	`isActive` boolean NOT NULL DEFAULT true,
	`roleId` int NOT NULL,
	`departmentId` int,
	`divisionId` int,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`),
	CONSTRAINT `User_npm_unique` UNIQUE(`npm`)
);
