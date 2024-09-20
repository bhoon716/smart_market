const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL 연결 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 오류: ", err);
  } else {
    console.log("MySQL 연결 성공");
  }
});

// 기본 라우트
app.get("/", (req, res) => {
  res.send("스마트 전통시장 서버가 작동 중입니다!");
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
