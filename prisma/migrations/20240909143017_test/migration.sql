-- AlterTable
ALTER TABLE `Assignment` ADD COLUMN `lastModified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Board` (
    `url` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,
    `lastModified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`url`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
