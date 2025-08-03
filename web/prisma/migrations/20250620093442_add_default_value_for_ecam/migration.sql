/*
  Warnings:

  - Made the column `ecam` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Course` MODIFY `ecam` BOOLEAN NOT NULL DEFAULT false;
