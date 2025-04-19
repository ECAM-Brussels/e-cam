/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Exercise` DROP FOREIGN KEY `Exercise_assignmentUrl_fkey`;

-- DropForeignKey
ALTER TABLE `Exercise` DROP FOREIGN KEY `Exercise_userEmail_fkey`;

-- DropTable
DROP TABLE `Exercise`;

-- CreateTable
CREATE TABLE `Submission` (
    `url` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,

    PRIMARY KEY (`url`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_url_fkey` FOREIGN KEY (`url`) REFERENCES `Assignment`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
