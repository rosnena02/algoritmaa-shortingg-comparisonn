-- Database schema untuk tabel mahasiswa
CREATE DATABASE IF NOT EXISTS db_mahasiswa;
USE db_mahasiswa;

-- Tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(16) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nik (nik),
    INDEX idx_nama (nama),
    INDEX idx_tanggal_lahir (tanggal_lahir)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


