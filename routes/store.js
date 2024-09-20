const express = require("express");
const router = express.Router();
const multer = require("multer");
const storeController = require("../controllers/storeController");

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 이미지 업로드 및 분석 라우트
router.post("/upload", upload.single("image"), storeController.analyzeImage);
module.exports = router;

/// get: /store 요청오면 db에서 가게 리스트 불러와서 전송
router.get("/store/list", (req, res) => {
  const query =
    "SELECT id, store_name, category, mainPicturePath, location, open_time, close_time FROM store";

  db.query(query, (err, results) => {
    if (err) {
      console.error("가게 리스트 불러오기 중 오류 발생:", err);
      res
        .status(500)
        .json({ error: "가게 리스트를 불러오는 중 오류가 발생했습니다." });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
