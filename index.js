const express = require('express');
const app = express();
require('dotenv').config(); // 환경변수 설정

const vendorRoutes = require('./routes/vendor'); // 상인 관련 라우트

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 연결
app.use('/api/vendors', vendorRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
