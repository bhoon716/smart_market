const db = require('../config/db');

// 상인 정보 추가
exports.addVendor = (req, res) => {
  const { store_name, location, menu, open_time, close_time } = req.body;

  const query = `INSERT INTO vendors (store_name, location, menu, open_time, close_time) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [store_name, location, menu, open_time, close_time], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: '상인 정보 등록 성공', vendorId: result.insertId });
  });
};

// 상인 정보 조회
exports.getVendors = (req, res) => {
  const query = 'SELECT * FROM vendors';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
