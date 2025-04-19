-- AlterTable
ALTER TABLE `Assignment` MODIFY `body` JSON NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `hash` VARCHAR(191) NULL,
    MODIFY `options` JSON NULL,
    MODIFY `title` VARCHAR(191) NULL;
