-- CreateTable
CREATE TABLE `Page` (
    `url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Page_url_key`(`url`),
    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
