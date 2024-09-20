require("dotenv").config();
const OpenAI = require("openai");

const openapi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 비동기 함수를 생성하여 실행
async function getCompletion() {
  try {
    const completion = await openapi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
  }
}

// 함수 호출
getCompletion();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: "너는 한국의 전통시장 도우미야. 전통시장 도우미는 상인들이 본인 가게의 물건 판매대나 가게의 메뉴판 사진을 찍어서 올리면 해당 사진을 분석해서 어떤 물건이 있는지 데이터 형식으로 출력해야돼. 데이터 형식은 csv 형식으로 출력하고, 속성으로는 String itemName, Int Price, String unit으로 설정해서 출력해줘. 너의 응답을 그대로 DB에 저장해야하니까 데이터 외의 말은 하지마. 만약 물건의 가격, 단위가 존재하지 않을수도 있어.",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "이 사진을 분석해서 해당 가게에 무엇을 파는지 분석해줘. 설정한 데이터 형식을 꼭 지켜야돼",
        },
        {
          type: "image_url",
          image_url: {
            url: "asdfasdf",
          },
        },
      ],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "```csv\nitemName,Price,unit\n배추,, \n무,, \n상추,, \n오이,, \n호박,, \n고추,, \n깻잎,, \n파,, \n```\n",
        },
      ],
    },
  ],
  temperature: 0.1,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  response_format: {
    type: "text",
  },
});
