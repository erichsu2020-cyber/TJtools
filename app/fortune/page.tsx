"use client";

import Link from "next/link";
import { useState } from "react";

type Tier = "great" | "good" | "neutral" | "bad" | "terrible";

interface FortuneLevel {
  name: string;
  weight: number;
  tier: Tier;
  color: string;
}

const FORTUNE_LEVELS: FortuneLevel[] = [
  { name: "大吉", weight: 10, tier: "great", color: "#dc2626" },
  { name: "中吉", weight: 15, tier: "good", color: "#ea580c" },
  { name: "小吉", weight: 20, tier: "good", color: "#d97706" },
  { name: "吉", weight: 20, tier: "good", color: "#ca8a04" },
  { name: "末吉", weight: 15, tier: "neutral", color: "#65a30d" },
  { name: "凶", weight: 12, tier: "bad", color: "#475569" },
  { name: "大凶", weight: 8, tier: "terrible", color: "#1f2937" },
];

const ASPECT_POOLS: Record<
  Tier,
  { overall: string[]; love: string[]; career: string[]; wealth: string[]; health: string[] }
> = {
  great: {
    overall: [
      "諸事順遂，把握機會大展身手！",
      "好運當頭，勇敢去做想做的事吧。",
      "今天做什麼都特別順，盡情發揮吧。",
    ],
    love: ["桃花朵朵開，單身者有機會遇到心動對象。", "感情升溫，適合主動表達心意。"],
    career: ["工作進展順利，努力會被看見。", "貴人相助，提案容易獲得認同。"],
    wealth: ["財運亨通，適合規劃投資。", "偏財運佳，小額投資可能有驚喜。"],
    health: ["精神飽滿，體力充沛。", "身心平衡，狀態極佳。"],
  },
  good: {
    overall: [
      "整體運勢平穩向上，保持積極態度就好。",
      "小小的努力會換來不錯的成果。",
      "運勢不錯，適合推進計畫中的事。",
    ],
    love: ["感情關係穩定發展，多一點陪伴更加分。", "單身者有機會認識新朋友。"],
    career: ["工作上有小進展，維持節奏繼續努力。", "與同事合作順暢，效率提升。"],
    wealth: ["財務狀況穩定，量入為出即可。", "適合存錢，避免衝動消費。"],
    health: ["體力尚可，注意規律作息。", "適合安排一些輕運動。"],
  },
  neutral: {
    overall: [
      "運勢平平，凡事按部就班即可。",
      "沒有太大起伏，穩紮穩打最重要。",
      "宜靜不宜動，先觀察再行動。",
    ],
    love: ["感情狀態持平，別急著做決定。", "單身者今天不妨多充實自己。"],
    career: ["工作進度平穩，避免躁進。", "適合整理與規劃，而非大幅開展新計畫。"],
    wealth: ["財運普通，不宜做重大決策。", "收支持平，記帳有助掌握狀況。"],
    health: ["狀態普通，留意睡眠品質。", "適度休息，別讓自己太緊繃。"],
  },
  bad: {
    overall: [
      "今天諸事宜小心謹慎，避免衝動行事。",
      "運勢略低，凡事多留一手比較保險。",
      "遇到阻礙時別硬碰硬，換個角度處理。",
    ],
    love: ["感情上容易有誤會，溝通要更耐心。", "單身者今天不適合告白。"],
    career: ["工作上可能遇到小狀況，仔細檢查再送出。", "避免與人起爭執，多聽少辯。"],
    wealth: ["財運不佳，避免衝動購物或投資。", "今天不宜借貸或簽署重要合約。"],
    health: ["容易疲勞，早點休息比較好。", "留意小感冒，注意保暖。"],
  },
  terrible: {
    overall: [
      "今天諸事不順，凡事以低調保守為上策。",
      "運勢較弱，建議減少外出與重大決定。",
      "宜靜心沉澱，避免做出衝動的選擇。",
    ],
    love: ["感情容易起波瀾，先以傾聽代替爭辯。", "單身者今天不適合展開新關係。"],
    career: ["工作上容易出錯，重要決定先緩一緩。", "避免簽署重要文件或做大改動。"],
    wealth: ["財運低迷，切勿投資或借貸。", "今天不適合做任何金錢上的大決定。"],
    health: ["容易感到疲倦或不適，多休息、多喝水。", "外出小心，避免逞強。"],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawFortuneLevel(): FortuneLevel {
  const totalWeight = FORTUNE_LEVELS.reduce((sum, f) => sum + f.weight, 0);
  let r = Math.random() * totalWeight;
  for (const level of FORTUNE_LEVELS) {
    if (r < level.weight) return level;
    r -= level.weight;
  }
  return FORTUNE_LEVELS[FORTUNE_LEVELS.length - 1];
}

interface FortuneResult {
  level: FortuneLevel;
  overall: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
}

export default function FortunePage() {
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);

  const today = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const handleDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setResult(null);

    setTimeout(() => {
      const level = drawFortuneLevel();
      const pool = ASPECT_POOLS[level.tier];
      setResult({
        level,
        overall: pickRandom(pool.overall),
        love: pickRandom(pool.love),
        career: pickRandom(pool.career),
        wealth: pickRandom(pool.wealth),
        health: pickRandom(pool.health),
      });
      setDrawing(false);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-12 dark:bg-black">
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow backdrop-blur transition-colors hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        ← 回首頁
      </Link>

      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          好運抽籤
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{today}</p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border-4 border-amber-400 bg-gradient-to-b from-red-700 via-red-800 to-red-950 p-8 shadow-2xl">
        <div
          className={`relative flex h-32 w-28 items-end justify-center rounded-t-full rounded-b-lg bg-gradient-to-b from-amber-700 to-amber-900 shadow-inner ${
            drawing ? "animate-shake" : ""
          }`}
        >
          {[-16, -6, 4, 14].map((offset, i) => (
            <div
              key={i}
              className="absolute bottom-16 h-24 w-1.5 rounded-full bg-amber-100"
              style={{ left: `calc(50% + ${offset}px)`, transform: "rotate(0deg)" }}
            />
          ))}
          <span className="mb-2 text-3xl">🎋</span>
        </div>

        <button
          onClick={handleDraw}
          disabled={drawing}
          className="rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-8 py-3 text-lg font-bold text-red-900 shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {drawing ? "抽籤中…" : "🙏 抽一支籤"}
        </button>

        {result && !drawing && (
          <div
            key={result.level.name + result.overall}
            className="animate-pop-in flex w-full flex-col items-center gap-4 rounded-xl border-2 bg-amber-50 p-6 text-center shadow-lg dark:bg-zinc-900"
            style={{ borderColor: result.level.color }}
          >
            <span
              className="text-5xl font-extrabold tracking-widest"
              style={{ color: result.level.color }}
            >
              {result.level.name}
            </span>
            <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
              {result.overall}
            </p>

            <div className="grid w-full grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-800">
                <span className="font-semibold text-rose-600">💕 愛情</span>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {result.love}
                </p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-800">
                <span className="font-semibold text-blue-600">💼 事業</span>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {result.career}
                </p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-800">
                <span className="font-semibold text-amber-600">💰 財運</span>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {result.wealth}
                </p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 dark:bg-zinc-800">
                <span className="font-semibold text-emerald-600">🌿 健康</span>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {result.health}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
