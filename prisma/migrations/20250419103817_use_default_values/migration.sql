/*
  Warnings:

  - Made the column `body` on table `Assignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Assignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hash` on table `Assignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `options` on table `Assignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Assignment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Assignment` MODIFY `body` JSON NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `hash` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `options` JSON NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL DEFAULT '';
