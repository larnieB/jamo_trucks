-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2026 at 04:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `truck_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `license_class` varchar(50) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `current_location` varchar(100) DEFAULT NULL,
  `expected_salary` decimal(10,2) DEFAULT NULL,
  `availability` varchar(50) DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `full_name`, `phone_number`, `email`, `license_class`, `experience_years`, `current_location`, `expected_salary`, `availability`, `documents`, `created_at`) VALUES
(1, 'charles kihumba', '0791353785', 'ckihumban@gmail.com', 'BCE', 20, 'Mombasa', 20000.00, 'Immediate', 'src/assets/drivers/1772012944_doc_0.webp', '2026-02-25 09:49:04');

-- --------------------------------------------------------

--
-- Table structure for table `trucks`
--

CREATE TABLE `trucks` (
  `id` int(11) NOT NULL,
  `numberPlate` varchar(20) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int(4) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `truck_condition` enum('New','Used','Refurbished') DEFAULT 'New',
  `paymentMethod` enum('Cash','Finance','skumaLoan') DEFAULT 'Cash',
  `images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deposit` decimal(15,2) DEFAULT 0.00,
  `bankBalance` decimal(15,2) DEFAULT 0.00,
  `monthlyInstallments` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trucks`
--

INSERT INTO `trucks` (`id`, `numberPlate`, `make`, `model`, `year`, `price`, `color`, `location`, `truck_condition`, `paymentMethod`, `images`, `created_at`, `deposit`, `bankBalance`, `monthlyInstallments`) VALUES
(55, 'KCV ', 'Isuzu', 'FSR', 2019, 4500000.00, 'blue', 'NAIROBI', 'Used', 'Cash', ' http://localhost:8080/jamo_trucks_admin/jamo_trucks/src/uploads/1771686410_image_0.webp, http://localhost:8080/jamo_trucks_admin/jamo_trucks/src/uploads/1771686410_image_1.webp, http://localhost:8080/jamo_trucks_admin/jamo_trucks/src/uploads/1771686410_image_2.webp, http://localhost:8080/jamo_trucks_admin/jamo_trucks/src/uploads/1771686410_image_3.webp', '2026-02-21 15:06:50', 0.00, 0.00, 0.00),
(56, 'kcp 123D', 'Volvo', 'scania', 2006, 200.00, 'blue', 'mangu', 'New', 'Cash', 'uploads/1771729199_image_0.webp', '2026-02-22 02:59:59', 0.00, 0.00, 0.00),
(57, 'kaa 123d', 'mercy', 'frr', 2002, 2000.00, 'white', 'Thika', 'New', 'Cash', 'uploads/1771730541_image_0.webp,uploads/1771730541_image_1.webp,uploads/1771730541_image_2.webp', '2026-02-22 03:22:21', 0.00, 0.00, 0.00),
(58, 'kcu 123p', 'Volvo', '233', 2002, 67809.00, 'green', 'Nakuru', 'New', 'Cash', 'uploads/1771732862_image_0.webp,uploads/1771732862_image_1.webp,uploads/1771732862_image_2.webp,uploads/1771732862_image_3.webp', '2026-02-22 04:01:02', 0.00, 0.00, 0.00),
(59, 'kab 123s', 'kariuki', 'npr', 2003, 2000000.00, '', 'Thika', 'Used', 'skumaLoan', 'uploads/1771733137_image_0.webp,uploads/1771733137_image_1.webp', '2026-02-22 04:05:37', 2000000.00, 1500000.00, 129981.00),
(62, 'kaa 123da', 'mercy2', 'kinjo', 2009, 209.00, 'green', 'Thika', 'New', 'Cash', 'uploads/1771758341_image_0.webp', '2026-02-22 11:05:41', 0.00, 0.00, 0.00),
(63, 'Kcw', 'Isuzu', 'npr', 2018, 2000000.00, 'blue', 'Nairobi', 'Used', 'Cash', 'uploads/1771762230_image_0.webp,uploads/1771762230_image_1.webp,uploads/1771762230_image_2.webp,uploads/1771762230_image_3.webp', '2026-02-22 12:10:30', 0.00, 0.00, 0.00),
(64, 'kba', 'Isuzu', 'npr', 2013, 3000000.00, '', 'Nakuru', 'New', 'Finance', 'uploads/1771762586_image_0.webp,uploads/1771762586_image_1.webp,uploads/1771762586_image_2.webp,uploads/1771762586_image_3.webp,uploads/1771762586_image_4.webp', '2026-02-22 12:16:26', 1000000.00, 2000000.00, 82986.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trucks`
--
ALTER TABLE `trucks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numberPlate` (`numberPlate`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trucks`
--
ALTER TABLE `trucks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
