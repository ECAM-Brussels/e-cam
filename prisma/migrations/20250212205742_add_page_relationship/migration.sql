-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_url_fkey` FOREIGN KEY (`url`) REFERENCES `Page`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;
