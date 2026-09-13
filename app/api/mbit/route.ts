import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是一位專業的 MBTI 性格分析師。使用者會用文字描述自己的個性、行為模式或喜好，你要根據描述推斷最符合的 MBTI 十六型人格，並說明四個維度（外向/內向、實感/直覺、思考/情感、判斷/感知）各自的判斷依據。

請務必只回傳 JSON，不要有任何其他文字或 Markdown，格式如下：
{
  "mbti": "四個字母組成的 MBTI 類型，例如 INTJ",
  "summary": "一段 2-3 句話的整體個性總結",
  "dimensions": {
    "EI": { "type": "E 或 I", "explanation": "判斷依據" },
    "SN": { "type": "S 或 N", "explanation": "判斷依據" },
    "TF": { "type": "T 或 F", "explanation": "判斷依據" },
    "JP": { "type": "J 或 P", "explanation": "判斷依據" }
  }
}`;

export async function POST(request: NextRequest) {
  let description: unknown;
  try {
    const body = await request.json();
    description = body?.description;
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "請輸入你的個性描述" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "伺服器尚未設定 OPENAI_API_KEY" },
      { status: 500 }
    );
  }

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
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: description },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json({ error: "分析失敗，請稍後再試" }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "分析失敗，請稍後再試" }, { status: 502 });
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("MBTI analysis error:", error);
    return NextResponse.json({ error: "分析失敗，請稍後再試" }, { status: 500 });
  }
}
