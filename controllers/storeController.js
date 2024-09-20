const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../config/db');

require('dotenv').config();

// GPT API 설정
const GPT_API_URL = 'https://api.openai.com/v1/images/analyze'; // GPT 4o-mini API URL
const GPT_API_KEY = process.env.GPT_API_KEY; // .env 파일에 API 키 저장

// 이미지 분석 함수
exports.analyzeImage = async (req, res) => {
  const imagePath = req.file.path;

  try {
    // 이미지를 읽어서 GPT API로 전송
    const image = fs.readFileSync(imagePath);
    const response = await axios.post(
      GPT_API_URL,
      {
        image: image.toString('base64'), // 이미지를 Base64로 인코딩하여 전송
      },
      {
        headers: {
          'Authorization': `Bearer ${GPT_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const result = response.data;

    // GPT API 결과에서 상품명, 가격, 단위 추출 (예시로 응답 파싱)
    const items = parseGPTResult(result);

    // 각 상품 정보를 DB에 저장 (상품명, 가격, 단위, 이미지 경로)
    items.forEach(item => {
      const query = `INSERT INTO items (item_name, price, unit, itemPicturePath) VALUES (?, ?, ?, ?)`;
      db.query(query, [item.name, item.price, item.unit, imagePath], (err, result) => {
        if (err) {
          console.error('DB 저장 오류:', err);
          return res.status(500).json({ error: err.message });
        }
      });
    });

    res.status(200).json({ message: '이미지 분석 및 상품 정보 저장 완료', items });
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    res.status(500).json({ error: '이미지 분석 실패' });
  }
};

// GPT API 응답 파싱 함수 (예시)
function parseGPTResult(result) {
  // GPT 응답에서 필요한 데이터를 추출하는 로직
  const items = [];

  result.forEach(itemData => {
    const name = itemData.name; // 상품명
    const price = itemData.price; // 가격
    const unit = itemData.unit; // 단위

    items.push({
      name: name,
      price: parseInt(price),
      unit: unit,
    });
  });

  return items;
}
