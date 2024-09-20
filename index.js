const express = require('express');
const bcrypt = require('bcrypt');  // 비밀번호 암호화
require('dotenv').config(); // 환경변수 설정
const connection = require('./config/db'); // DB 연결 파일
const vendorRoutes = require('./routes/vendor'); // 상인 관련 라우트

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 상인 라우트 연결
app.use('/api/vendors', vendorRoutes);

// 회원가입 라우트
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('아이디와 비밀번호를 입력해주세요.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(query, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('회원가입 오류:', err);
      return res.status(500).send('회원가입 실패');
    }
    res.status(200).send('회원가입 성공');
  });
});

/// 로그인 라우트
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error('로그인 오류:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: '비밀번호가 틀렸습니다.' });
    }

    res.status(200).json({ success: true, message: '로그인 성공' });
  });
});


// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
