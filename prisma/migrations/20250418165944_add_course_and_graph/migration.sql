/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `finished` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_url_fkey`;

-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_userEmail_fkey`;

-- DropIndex
DROP INDEX `Assignment_userEmail_fkey` ON `Assignment`;

-- AlterTable
ALTER TABLE `Assignment` DROP PRIMARY KEY,
    DROP COLUMN `finished`,
    DROP COLUMN `id`,
    DROP COLUMN `userEmail`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `options` JSON NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`url`);

-- DropTable
DROP TABLE `Page`;

-- CreateTable
CREATE TABLE `Course` (
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `assignmentUrl` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `state` JSON NOT NULL,
    `correct` BOOLEAN NOT NULL,
    `attempts` JSON NOT NULL,

    PRIMARY KEY (`assignmentUrl`, `userEmail`, `index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AssignmentToCourse` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AssignmentToCourse_AB_unique`(`A`, `B`),
    INDEX `_AssignmentToCourse_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Prerequisites` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Prerequisites_AB_unique`(`A`, `B`),
    INDEX `_Prerequisites_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_assignmentUrl_fkey` FOREIGN KEY (`assignmentUrl`) REFERENCES `Assignment`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentToCourse` ADD CONSTRAINT `_AssignmentToCourse_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentToCourse` ADD CONSTRAINT `_AssignmentToCourse_B_fkey` FOREIGN KEY (`B`) REFERENCES `Course`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Prerequisites` ADD CONSTRAINT `_Prerequisites_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Prerequisites` ADD CONSTRAINT `_Prerequisites_B_fkey` FOREIGN KEY (`B`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;
