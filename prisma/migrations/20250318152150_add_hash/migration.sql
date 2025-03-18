/*
  Warnings:

  - You are about to drop the column `lastModified` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Page` DROP COLUMN `lastModified`,
    ADD COLUMN `hash` VARCHAR(191) NULL;
