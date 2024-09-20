const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const { analyzeImage } = require("./script/analyzeImage");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL 데이터베이스 연결
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

// Multer 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 업로드 폴더 설정
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});
const upload = multer({ storage });

// 가게 리스트 API
app.get("/api/stores", (req, res) => {
  const query = `
    SELECT id, store_name, category, mainPicturePath, location, open_time, close_time
    FROM store`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("가게 리스트 불러오기 중 오류 발생:", err);
      return res
        .status(500)
        .json({ error: "가게 리스트를 불러오는 중 오류가 발생했습니다." });
    }
    res.json(results); // 가게 목록을 클라이언트에 전달
  });
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
      return res
        .status(500)
        .json({ error: "가게 정보를 불러오는 중 오류가 발생했습니다." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "해당 가게를 찾을 수 없습니다." });
    }
    res.json(results[0]); // 가게 정보를 클라이언트에 전달
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
      return res
        .status(500)
        .json({ error: "메뉴 정보를 불러오는 중 오류가 발생했습니다." });
    }
    res.json(results); // 메뉴 정보를 클라이언트에 전달
  });
});

// 메뉴 저장 API
app.post("/api/save-menu", (req, res) => {
  const menuItems = req.body; // 클라이언트에서 보낸 메뉴 데이터
  const storeId = 1; // 현재 예시로 store_id를 1로 설정 (실제 서비스에서는 사용자와 연동)

  if (!menuItems || menuItems.length === 0) {
    return res.status(400).json({ error: "저장할 메뉴 데이터가 없습니다." });
  }

  // 여러 개의 메뉴 아이템을 한번에 삽입하는 쿼리
  const query = `
    INSERT INTO menu (store_id, item_name, price, itemPicturePath)
    VALUES ?
  `;

  const values = menuItems.map((item) => [
    storeId,
    item.item_name,
    item.price,
    item.itemPicturePath,
  ]);

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("메뉴 저장 중 오류 발생:", err);
      return res
        .status(500)
        .json({ error: "메뉴 저장 중 오류가 발생했습니다." });
    }
    res.status(200).json({ message: "메뉴가 성공적으로 저장되었습니다." });
  });
});

// 이미지 업로드 및 분석 처리 API
app.post("/api/upload", upload.single("image"), analyzeImage);

// 기본 경로 설정 (index.html 제공)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
