const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// 상인 정보 추가
router.post('/', vendorController.addVendor);

// 상인 정보 조회
router.get('/', vendorController.getVendors);

module.exports = router;
