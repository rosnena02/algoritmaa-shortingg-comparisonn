require('dotenv').config();
const express = require('express');
const path = require('path');
const { pool, testConnection } = require('./database/config');
const { sortWithAlgorithm } = require('./algorithms/sorting');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get semua data mahasiswa
app.get('/api/mahasiswa', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM mahasiswa');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Sorting dengan algoritma tertentu
app.post('/api/sort', async (req, res) => {
  try {
    const { algorithm, sortBy = 'nik', limit = null } = req.body;
    
    if (!algorithm || !['quick', 'heap', 'merge', 'bubble'].includes(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algoritma harus salah satu dari: quick, heap, merge, bubble'
      });
    }
    
    // Ambil data dari database
    let query = 'SELECT * FROM mahasiswa';
    if (limit && limit > 0) {
      query += ` LIMIT ${parseInt(limit)}`;
    }
    
    const [rows] = await pool.execute(query);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tidak ada data mahasiswa di database'
      });
    }
    
    // Update fungsi compare berdasarkan sortBy
    const originalSort = require('./algorithms/sorting');
    
    // Lakukan sorting
    const result = sortWithAlgorithm(rows, algorithm);
    
    res.json({
      success: true,
      algorithm: algorithm,
      sortBy: sortBy,
      executionTime: result.executionTime + ' ms',
      dataCount: result.dataCount,
      data: result.sortedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Get statistik
app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM mahasiswa');
    res.json({
      success: true,
      totalMahasiswa: rows[0].total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test koneksi database saat server start
testConnection().then(success => {
  if (success) {
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'db_mahasiswa'}`);
    });
  } else {
    console.error('❌ Server tidak dapat dimulai karena koneksi database gagal');
    process.exit(1);
  }
});


