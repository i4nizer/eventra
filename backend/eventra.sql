-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 30, 2025 at 10:16 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventra`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `fine` decimal(10,2) NOT NULL DEFAULT '20.00',
  `description` varchar(512) NOT NULL DEFAULT '',
  `startAt` datetime NOT NULL,
  `finishAt` datetime NOT NULL,
  `evaluated` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `name`, `fine`, `description`, `startAt`, `finishAt`, `evaluated`, `createdAt`, `updatedAt`) VALUES
(1, 'General Assembly', '20.00', 'Mandatory school-wide assembly', '2025-01-10 07:00:00', '2025-01-10 12:00:00', 1, '2025-12-01 05:57:00', '2025-11-30 22:00:22'),
(2, 'IT Department Orientation', '20.00', 'Orientation for new IT students', '2025-01-12 07:00:00', '2025-01-12 12:00:00', 1, '2025-12-01 05:57:00', '2025-11-30 22:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `activities-entries`
--

CREATE TABLE `activities-entries` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `startAt` datetime NOT NULL,
  `finishAt` datetime NOT NULL,
  `activityId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activities-entries`
--

INSERT INTO `activities-entries` (`id`, `name`, `startAt`, `finishAt`, `activityId`, `createdAt`, `updatedAt`) VALUES
(1, 'IN AM', '2025-01-10 07:00:00', '2025-01-10 08:00:00', 1, '2025-12-01 05:58:18', '2025-12-01 05:58:18'),
(2, 'OUT AM', '2025-01-10 11:00:00', '2025-01-10 12:00:00', 1, '2025-12-01 05:58:18', '2025-12-01 05:58:18'),
(3, 'IN AM', '2025-01-12 07:00:00', '2025-01-12 08:00:00', 2, '2025-12-01 05:58:18', '2025-12-01 05:58:18'),
(4, 'OUT AM', '2025-01-12 11:00:00', '2025-01-12 12:00:00', 2, '2025-12-01 05:58:18', '2025-12-01 05:58:18');

-- --------------------------------------------------------

--
-- Table structure for table `activities-sections`
--

CREATE TABLE `activities-sections` (
  `id` int NOT NULL,
  `sectionId` int NOT NULL,
  `activityId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activities-sections`
--

INSERT INTO `activities-sections` (`id`, `sectionId`, `activityId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-12-01 05:58:02', '2025-12-01 05:58:02'),
(2, 2, 1, '2025-12-01 05:58:02', '2025-12-01 05:58:02'),
(3, 3, 1, '2025-12-01 05:58:02', '2025-12-01 05:58:02'),
(4, 1, 2, '2025-12-01 05:58:02', '2025-12-01 05:58:02'),
(5, 2, 2, '2025-12-01 05:58:02', '2025-12-01 05:58:02'),
(6, 3, 2, '2025-12-01 05:58:02', '2025-12-01 05:58:02');

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int NOT NULL,
  `entryId` int NOT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `entryId`, `studentId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-01-10 07:15:00', '2025-01-10 07:15:00'),
(2, 1, 2, '2025-01-10 07:30:00', '2025-01-10 07:30:00'),
(3, 1, 3, '2025-01-10 07:55:00', '2025-01-10 07:55:00'),
(4, 1, 5, '2025-01-10 07:20:00', '2025-01-10 07:20:00'),
(5, 1, 7, '2025-01-10 07:10:00', '2025-01-10 07:10:00'),
(6, 2, 1, '2025-01-10 11:10:00', '2025-01-10 11:10:00'),
(7, 2, 2, '2025-01-10 11:20:00', '2025-01-10 11:20:00'),
(8, 2, 3, '2025-01-10 11:30:00', '2025-01-10 11:30:00'),
(9, 2, 5, '2025-01-10 11:05:00', '2025-01-10 11:05:00'),
(10, 2, 7, '2025-01-10 11:50:00', '2025-01-10 11:50:00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `value` int NOT NULL,
  `remarks` varchar(255) NOT NULL DEFAULT '',
  `violationId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `value`, `remarks`, `violationId`, `createdAt`, `updatedAt`) VALUES
(1, 20, 'Paid in cashier', 1, '2025-12-01 05:58:56', '2025-12-01 05:58:56'),
(2, 20, 'Paid via GCash', 3, '2025-12-01 05:58:56', '2025-12-01 05:58:56'),
(3, 20, 'Paid late', 5, '2025-12-01 05:58:56', '2025-12-01 05:58:56');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name`, `year`, `createdAt`, `updatedAt`) VALUES
(1, 'BSIT - A', 1, '2025-12-01 05:56:30', '2025-12-01 05:56:30'),
(2, 'BSIT - B', 1, '2025-12-01 05:56:30', '2025-12-01 05:56:30'),
(3, 'BSCS - A', 2, '2025-12-01 05:56:30', '2025-12-01 05:56:30');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL,
  `sid` varchar(255) NOT NULL,
  `rfid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `sectionId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `sid`, `rfid`, `name`, `email`, `photo`, `sectionId`, `createdAt`, `updatedAt`) VALUES
(1, '2025-001', 'RFID1001', 'Alice Santos', 'alice.santos@example.com', '/photos/1.jpg', 1, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(2, '2025-002', 'RFID1002', 'Brian Cruz', 'brian.cruz@example.com', '/photos/2.jpg', 1, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(3, '2025-003', 'RFID1003', 'Carla Dizon', 'carla.dizon@example.com', '/photos/3.jpg', 1, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(4, '2025-004', 'RFID1004', 'David Lim', 'david.lim@example.com', '/photos/4.jpg', 2, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(5, '2025-005', 'RFID1005', 'Ella Torres', 'ella.torres@example.com', '/photos/5.jpg', 2, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(6, '2025-006', 'RFID1006', 'Francis Uy', 'francis.uy@example.com', '/photos/6.jpg', 2, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(7, '2025-007', 'RFID1007', 'Grace Tan', 'grace.tan@example.com', '/photos/7.jpg', 3, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(8, '2025-008', 'RFID1008', 'Henry Chua', 'henry.chua@example.com', '/photos/8.jpg', 3, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(9, '2025-009', 'RFID1009', 'Isabella Ong', 'isabella.ong@example.com', '/photos/9.jpg', 3, '2025-12-01 05:56:47', '2025-12-01 05:56:47'),
(10, '2025-010', 'RFID1010', 'Jake Villanueva', 'jake.villanueva@example.com', '/photos/10.jpg', 1, '2025-12-01 05:56:47', '2025-12-01 05:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `violations`
--

CREATE TABLE `violations` (
  `id` int NOT NULL,
  `fine` int NOT NULL,
  `entryId` int NOT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `violations`
--

INSERT INTO `violations` (`id`, `fine`, `entryId`, `studentId`, `createdAt`, `updatedAt`) VALUES
(1, 20, 1, 4, '2025-12-01 05:58:44', '2025-12-01 05:58:44'),
(2, 20, 1, 6, '2025-12-01 05:58:44', '2025-12-01 05:58:44'),
(3, 20, 1, 8, '2025-12-01 05:58:44', '2025-12-01 05:58:44'),
(4, 20, 1, 9, '2025-12-01 05:58:44', '2025-12-01 05:58:44'),
(5, 20, 1, 10, '2025-12-01 05:58:44', '2025-12-01 05:58:44'),
(6, 20, 2, 4, '2025-11-30 22:00:22', '2025-11-30 22:00:22'),
(7, 20, 2, 6, '2025-11-30 22:00:22', '2025-11-30 22:00:22'),
(8, 20, 2, 8, '2025-11-30 22:00:22', '2025-11-30 22:00:22'),
(9, 20, 2, 9, '2025-11-30 22:00:22', '2025-11-30 22:00:22'),
(10, 20, 2, 10, '2025-11-30 22:00:22', '2025-11-30 22:00:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `activities-entries`
--
ALTER TABLE `activities-entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activityId` (`activityId`);

--
-- Indexes for table `activities-sections`
--
ALTER TABLE `activities-sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sectionId` (`sectionId`),
  ADD KEY `activityId` (`activityId`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entryId` (`entryId`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `violationId` (`violationId`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sid` (`sid`),
  ADD UNIQUE KEY `rfid` (`rfid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `sectionId` (`sectionId`);

--
-- Indexes for table `violations`
--
ALTER TABLE `violations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entryId` (`entryId`),
  ADD KEY `studentId` (`studentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `activities-entries`
--
ALTER TABLE `activities-entries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `activities-sections`
--
ALTER TABLE `activities-sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `violations`
--
ALTER TABLE `violations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities-entries`
--
ALTER TABLE `activities-entries`
  ADD CONSTRAINT `activities-entries_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `activities-sections`
--
ALTER TABLE `activities-sections`
  ADD CONSTRAINT `activities-sections_ibfk_45` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activities-sections_ibfk_46` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_45` FOREIGN KEY (`entryId`) REFERENCES `activities-entries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_46` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`violationId`) REFERENCES `violations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`sectionId`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `violations`
--
ALTER TABLE `violations`
  ADD CONSTRAINT `violations_ibfk_45` FOREIGN KEY (`entryId`) REFERENCES `activities-entries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_46` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
