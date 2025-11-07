require('dotenv').config();
const mysql = require('mysql2/promise');
const faker = require('faker');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_mahasiswa',
  port: process.env.DB_PORT || 3306
};

// Generate NIK (16 digit)
function generateNIK() {
  let nik = '';
  for (let i = 0; i < 16; i++) {
    nik += Math.floor(Math.random() * 10);
  }
  return nik;
}

// Generate tanggal lahir (antara 18-25 tahun yang lalu)
function generateTanggalLahir() {
  const today = new Date();
  const maxAge = 25;
  const minAge = 18;
  const birthYear = today.getFullYear() - (minAge + Math.floor(Math.random() * (maxAge - minAge + 1)));
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  return `${birthYear}-${String(birthMonth + 1).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
}

async function seedDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Terhubung ke database MySQL');
    
    // Hapus data lama
    await connection.execute('TRUNCATE TABLE mahasiswa');
    console.log('🗑️  Data lama dihapus');
    
    const totalRecords = 5000;
    const batchSize = 100;
    const batches = Math.ceil(totalRecords / batchSize);
    
    console.log(`📝 Memulai generate ${totalRecords} data mahasiswa...`);
    
    for (let batch = 0; batch < batches; batch++) {
      const values = [];
      const currentBatchSize = Math.min(batchSize, totalRecords - (batch * batchSize));
      
      for (let i = 0; i < currentBatchSize; i++) {
        const nik = generateNIK();
        const nama = faker.name.findName();
        const alamat = faker.address.streetAddress() + ', ' + faker.address.city();
        const tanggalLahir = generateTanggalLahir();
        
        values.push([nik, nama, alamat, tanggalLahir]);
      }
      
      const query = 'INSERT INTO mahasiswa (nik, nama, alamat, tanggal_lahir) VALUES ?';
      await connection.query(query, [values]);
      
      const progress = Math.round(((batch + 1) * batchSize / totalRecords) * 100);
      console.log(`⏳ Progress: ${Math.min(progress, 100)}% (${Math.min((batch + 1) * batchSize, totalRecords)}/${totalRecords})`);
    }
    
    console.log('✅ Data berhasil di-generate!');
    
    // Verifikasi jumlah data
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM mahasiswa');
    console.log(`📊 Total data dalam database: ${rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Koneksi database ditutup');
    }
  }
}

seedDatabase();


