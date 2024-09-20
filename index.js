const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
  } else {
    console.log("MySQL 연결 성공");
  }
});

// 정적 파일 제공 (HTML, CSS, JS 파일)
app.use(express.static(path.join(__dirname, "public")));

// 가게 리스트 API
app.get("/api/stores", (req, res) => {
  const query =
    "SELECT id, store_name, category, mainPicturePath, location, open_time, close_time FROM store";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("가게 리스트 불러오기 중 오류 발생:", err);
      res
        .status(500)
        .json({ error: "가게 리스트를 불러오는 중 오류가 발생했습니다." });
    } else {
      res.json(results); // 가게 목록을 클라이언트에 전달
    }
  });
});

// 기본 경로 설정 (index.html 제공)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
