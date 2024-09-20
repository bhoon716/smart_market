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

// store.html에 대한 명시적 라우트 추가
app.get("/html/store.html", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "store.html"));
});

// 특정 가게 정보 API
app.get("/api/stores/:storeId", (req, res) => {
  const storeId = req.params.storeId;
  const query = `
    SELECT id, store_name, category, mainPicturePath, location, open_time, close_time
    FROM store
    WHERE id = ?`;

  connection.query(query, [storeId], (err, results) => {
    if (err) {
      console.error("가게 정보를 불러오는 중 오류 발생:", err);
      res
        .status(500)
        .json({ error: "가게 정보를 불러오는 중 오류가 발생했습니다." });
    } else if (results.length === 0) {
      res.status(404).json({ error: "해당 가게를 찾을 수 없습니다." });
    } else {
      res.json(results[0]); // 가게 정보를 클라이언트에 전달
    }
  });
});

// 특정 가게의 판매 물품 API
app.get("/api/stores/:storeId/menu", (req, res) => {
  const storeId = req.params.storeId;
  const query = `
    SELECT id, item_name, price, itemPicturePath
    FROM menu
    WHERE store_id = ?`;

  connection.query(query, [storeId], (err, results) => {
    if (err) {
      console.error("메뉴 정보를 불러오는 중 오류 발생:", err);
      res
        .status(500)
        .json({ error: "메뉴 정보를 불러오는 중 오류가 발생했습니다." });
    } else {
      res.json(results); // 메뉴 정보를 클라이언트에 전달
    }
  });
});

///////////////////////////////////////////////////////////

// 기본 경로 설정 (index.html 제공)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
