const express = require("express");
const path = require("path");
const app = express();
const storeRoutes = require("./routes/store");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "public")));

// API 라우트 연결
app.use("/api", storeRoutes);

// 기본 경로 설정 (index.html 제공)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 정적 파일 제공 (이미지 경로 등)
app.use("/uploads", express.static("uploads"));

// 기본 라우트
app.use("/api/store", storeRoutes);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("스마트 전통시장 서버가 작동 중입니다!");
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
