const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL 연결 설정

// 가게 리스트 불러오기 API
router.get("/stores", (req, res) => {
  const query =
    "SELECT id, store_name, category, mainPicturePath, location, open_time, close_time FROM store";

  db.query(query, (err, results) => {
    if (err) {
      console.error("가게 리스트 불러오기 중 오류 발생:", err);
      res
        .status(500)
        .json({ error: "가게 리스트를 불러오는 중 오류가 발생했습니다." });
    } else {
      res.json(results); // 클라이언트에 가게 목록 전달
    }
  });
});

module.exports = router;
