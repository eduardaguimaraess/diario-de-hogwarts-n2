CREATE DATABASE IF NOT EXISTS diario_hogwarts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE diario_hogwarts;

CREATE TABLE IF NOT EXISTS schedule (
  id VARCHAR(30) PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  professor VARCHAR(100) NOT NULL,
  classroom VARCHAR(100) NOT NULL,
  time VARCHAR(30) NOT NULL,
  dayOfWeek VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  house ENUM('Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
