-- CreateTable
CREATE TABLE `Assignment` (
    `url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `body` JSON NOT NULL,
    `options` JSON NOT NULL,
    `hash` VARCHAR(191) NOT NULL DEFAULT '',
    `lastModified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `video` VARCHAR(191) NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `image` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `hash` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 1500,

    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 1500,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attempt` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `exercise` JSON NOT NULL,
    `correct` BOOLEAN NULL,
    `gain` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastModified` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Attempt_url_email_position_key`(`url`, `email`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stroke` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `ownerEmail` VARCHAR(191) NOT NULL,
    `board` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#255994',
    `lineWidth` INTEGER NOT NULL DEFAULT 2,
    `points` JSON NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
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
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_url_fkey` FOREIGN KEY (`url`) REFERENCES `Assignment`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attempt` ADD CONSTRAINT `Attempt_hash_fkey` FOREIGN KEY (`hash`) REFERENCES `Question`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stroke` ADD CONSTRAINT `Stroke_ownerEmail_fkey` FOREIGN KEY (`ownerEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentToCourse` ADD CONSTRAINT `_AssignmentToCourse_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignmentToCourse` ADD CONSTRAINT `_AssignmentToCourse_B_fkey` FOREIGN KEY (`B`) REFERENCES `Course`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Prerequisites` ADD CONSTRAINT `_Prerequisites_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Prerequisites` ADD CONSTRAINT `_Prerequisites_B_fkey` FOREIGN KEY (`B`) REFERENCES `Assignment`(`url`) ON DELETE CASCADE ON UPDATE CASCADE;
