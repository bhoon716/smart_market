const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 이미지 분석 함수
async function analyzeImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "이미지가 업로드되지 않았습니다." });
  }

  const imagePath = path.join(__dirname, "../uploads/", req.file.filename);

  try {
    // 이미지를 읽어 Base64로 인코딩
    const image = fs.readFileSync(imagePath, { encoding: "base64" });

    // GPT API에 요청
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "너는 한국의 전통시장 도우미야. 전통시장 도우미는 상인들이 본인 가게의 물건 판매대나 가게의 메뉴판 사진을 찍어서 올리면 해당 사진을 분석해서 어떤 물건이 있는지 데이터 형식으로 출력해야돼. 데이터 형식은 csv 형식으로 출력하고, 속성으로는 String itemName, Int Price으로 설정해서 출력해줘. 너의 응답을 그대로 DB에 저장해야하니까 데이터 외의 말은 하지마. 물건의 가격이 적혀있지 않을 수도 있어. 가격이 적혀있지 않으면 0 으로 표기해줘. 돈의 단위는 작성하지 말고 오로지 숫자만 적어줘.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "이 사진을 분석해서 해당 가게에 무엇을 파는지 분석해줘. 설정한 데이터 형식을 꼭 지켜야돼.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const result = response.choices[0].message.content;
    console.log("GPT API 분석 결과 (CSV):\n", result);

    // 클라이언트에게 CSV 형식 결과 반환
    res.status(200).json({ message: "이미지 분석 성공", result });
  } catch (error) {
    console.error("이미지 분석 중 오류 발생:", error);
    res.status(500).json({ error: "이미지 분석 실패" });
  }
}

module.exports = { analyzeImage };
