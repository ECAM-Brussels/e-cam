/*
  Warnings:

  - You are about to drop the column `description` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `description`,
    DROP COLUMN `title`,
    MODIFY `options` JSON NULL,
    MODIFY `hash` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Course` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `url` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Page` (
    `url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_url_fkey` FOREIGN KEY (`url`) REFERENCES `Page`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;
