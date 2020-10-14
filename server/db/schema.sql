DROP DATABASE IF EXISTS radma;

create database radma;

use radma;

CREATE TABLE `shows` (
  `id` int primary key not null AUTO_INCREMENT,
  `venue` varchar(255),
  `date` date,
  `address` int,
  `details` varchar(255)
);

CREATE TABLE `genres` (
  `id` int primary key not null AUTO_INCREMENT,
  `genre_name` varchar(255)
);

CREATE TABLE `bands` (
  `id` int primary key not null AUTO_INCREMENT,
  `name` varchar(255),
  `genre` int
);

CREATE TABLE `user` (
  `id` int primary key not null AUTO_INCREMENT,
  `user_name` varchar(255),
  `password` varchar(255),
  `genre` int,
  `pictures` varchar(255),
  `profile_pic` varchar(255),
  `status` varchar(255),
  `bio` varchar(255)
);
CREATE TABLE `message` (
  `id` int primary key not null AUTO_INCREMENT,
  `text` varchar(255),
  `pictures` varchar(255),
  `userId` int,
  `showId` int,
);

CREATE TABLE `shows_bands_join` (
  `id` int primary key not null AUTO_INCREMENT,
  `show_id` int,
  `band_id` int
);

ALTER TABLE `shows_bands_join` ADD FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`);
ALTER TABLE `shows_bands_join` ADD FOREIGN KEY (`band_id`) REFERENCES `bands` (`id`);
ALTER TABLE `user` ADD FOREIGN KEY (`genre`) REFERENCES `genres` (`id`);
ALTER TABLE `bands` ADD FOREIGN KEY (`genre`) REFERENCES `genres` (`id`);
ALTER TABLE `message` ADD FOREIGN KEY (`userId`) REFERENCES `user` (`id`);
ALTER TABLE `message` ADD FOREIGN KEY (`showId`) REFERENCES `show` (`id`);
-- mysql -u root < server/db/schema.sql
