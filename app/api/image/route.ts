import { NextRequest, NextResponse } from "next/server";

const STYLE_SUFFIX =
  "，動漫卡通風格，日系動畫插畫，鮮豔色彩，乾淨線稿，2D anime illustration style";

export async function POST(request: NextRequest) {
  let description: unknown;
  try {
    const body = await request.json();
    description = body?.description;
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "請輸入圖片描述" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "伺服器尚未設定 OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `${description.trim()}${STYLE_SUFFIX}`,
        size: "1024x1024",
        n: 1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI Image API error:", errText);
      return NextResponse.json({ error: "圖片生成失敗，請稍後再試" }, { status: 502 });
    }

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "圖片生成失敗，請稍後再試" }, { status: 502 });
    }

    return NextResponse.json({ image: `data:image/png;base64,${b64}` });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "圖片生成失敗，請稍後再試" }, { status: 500 });
  }
}
