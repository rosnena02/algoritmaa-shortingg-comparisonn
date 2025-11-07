require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
};

async function setupDatabase() {
  let connection;
  
  try {
    // Connect tanpa memilih database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Terhubung ke MySQL server');
    
    // Buat database jika belum ada
    await connection.query('CREATE DATABASE IF NOT EXISTS db_mahasiswa');
    console.log('✅ Database db_mahasiswa sudah siap');
    
    // Tutup koneksi pertama
    await connection.end();
    
    // Connect langsung ke database
    dbConfig.database = 'db_mahasiswa';
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Terhubung ke database db_mahasiswa');
    
    // Buat tabel
    const createTableQuery = `
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
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Tabel mahasiswa sudah dibuat');
    
    // Verifikasi
    const [tables] = await connection.query('SHOW TABLES');
    console.log('✅ Tabel yang ada:', tables.map(t => Object.values(t)[0]).join(', '));
    
    console.log('\n🎉 Setup database selesai! Sekarang Anda bisa menjalankan: npm run seed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

