-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2024 at 09:23 AM
-- Server version: 8.0.37
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nescatweb`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commentId` int NOT NULL,
  `content` longtext,
  `username` varchar(45) DEFAULT NULL,
  `postId` int NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `imgUrl` varchar(255) DEFAULT NULL,
  `pinned` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `postId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postId` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  `content` longtext,
  `username` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `imgUrl` varchar(255) DEFAULT NULL,
  `likes` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postId`, `topic`, `content`, `username`, `created_date`, `imgUrl`, `likes`) VALUES
(71, 'How does fuzzy algorithm work?', '<p>A <strong>fuzzy search algorithm</strong> helps find results that are similar but not exact, useful when searching for terms that might be misspelled or slightly different. Unlike exact search algorithms, which look for an exact match, fuzzy search allows for a margin of error or \"fuzziness.\"</p><p>Here’s how it works in simpler terms:</p><p><br></p><ol><li><strong>Approximate matching:</strong> Fuzzy search looks for results that are close to the searched word, even if there are typos or small differences.</li><li><strong>Distance measurement:</strong> It often uses a method like \"Levenshtein distance,\" which counts how many single-character edits (like insertions, deletions, or substitutions) it takes to turn one word into another. For example, \"cat\" and \"bat\" have a distance of 1 because only one letter needs to change.</li><li><strong>Threshold:</strong> The algorithm uses a threshold to decide how many changes are acceptable to still consider two words a match.</li><li><strong>Ranked results:</strong> It ranks search results by how closely they match the search term. The closer the match (fewer changes needed), the higher the result appears.</li></ol><p>Fuzzy search is common in search engines, spell checkers, and data retrieval systems where people might make errors while typing.</p>', 'admin', '2024-09-27 08:20:43', 'e837820d-d6bd-461c-b9dd-f76ecd6c269e-pexels-pixabay-268533.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT CURRENT_TIMESTAMP,
  `imgUrl` varchar(255) DEFAULT NULL,
  `userType` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `name`, `username`, `email`, `password`, `created_date`, `last_login`, `imgUrl`, `userType`) VALUES
(16, 'abhishek', 'abhishek', 'abhishek@email.com', 'Password@123', '2024-07-21 11:14:36', '2024-07-21 11:14:36', 'b3b5d03a-347b-435b-8af0-df64328bc153-forbidden.png', 'user'),
(17, 'Admin ', 'admin', 'admin@admin.com', 'Password@123', '2024-09-27 08:18:25', '2024-09-27 08:18:25', NULL, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentId`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `commentId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `postId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
