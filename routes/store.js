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
