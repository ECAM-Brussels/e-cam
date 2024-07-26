-- CreateTable
CREATE TABLE `Assignment` (
    `url` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,

    PRIMARY KEY (`url`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
