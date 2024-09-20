const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // 이미지를 uploads 폴더에 저장
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // 파일 이름을 유니크하게 생성
    }
  });

  const upload = multer({ storage: storage });

// 이미지 업로드 및 분석 라우트
router.post('/upload', upload.single('image'), storeController.analyzeImage);

module.exports = router;