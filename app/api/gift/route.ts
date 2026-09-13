import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是一位專業的送禮顧問。使用者會提供收禮對象的年齡層、地區、興趣、預算與送禮場合，你要根據這些條件推薦 3 到 5 個合適的禮物。

請務必只回傳 JSON，不要有任何其他文字或 Markdown，格式如下：
{
  "summary": "一段 2-3 句話的整體推薦摘要",
  "gifts": [
    { "name": "禮物名稱", "reason": "推薦這個禮物的原因", "priceRange": "大概的價格區間" }
  ]
}`;

interface GiftRequestBody {
  age?: string;
  region?: string;
  interest?: string;
  budget?: string;
  occasion?: string;
}

export async function POST(request: NextRequest) {
  let body: GiftRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const { age, region, interest, budget, occasion } = body;

  if (!age || !region || !interest || !budget || !occasion) {
    return NextResponse.json({ error: "請選擇完整的條件" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "伺服器尚未設定 OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  const userPrompt = `收禮對象條件如下：
年齡層：${age}
地區：${region}
興趣：${interest}
預算：${budget}
送禮場合：${occasion}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.8,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json({ error: "推薦失敗，請稍後再試" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "推薦失敗，請稍後再試" }, { status: 502 });
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Gift recommendation error:", error);
    return NextResponse.json({ error: "推薦失敗，請稍後再試" }, { status: 500 });
  }
}
