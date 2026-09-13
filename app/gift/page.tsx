"use client";

import Link from "next/link";
import { useState } from "react";

interface Gift {
  name: string;
  reason: string;
  priceRange: string;
}

interface GiftResult {
  summary: string;
  gifts: Gift[];
}

const AGE_OPTIONS = ["兒童 (0-12歲)", "青少年 (13-17歲)", "青年 (18-25歲)", "成年 (26-40歲)", "中年 (41-60歲)", "銀髮族 (60歲以上)"];
const REGION_OPTIONS = ["台灣", "日本", "韓國", "歐美", "其他地區"];
const INTEREST_OPTIONS = ["運動健身", "3C 科技", "閱讀", "美妝保養", "遊戲", "美食", "旅遊", "音樂", "藝術文創", "居家生活"];
const BUDGET_OPTIONS = ["500 元以下", "500-1000 元", "1000-3000 元", "3000-5000 元", "5000 元以上"];
const OCCASION_OPTIONS = ["生日", "節日", "畢業", "結婚", "升遷", "感謝", "情人節"];

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      >
        <option value="">請選擇</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function GiftPage() {
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [interest, setInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [occasion, setOccasion] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GiftResult | null>(null);

  const isComplete = age && region && interest && budget && occasion;

  const handleRecommend = async () => {
    if (loading || !isComplete) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, region, interest, budget, occasion }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "推薦失敗，請稍後再試");
      }

      setResult(data as GiftResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "推薦失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
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
          🎁 禮物推薦
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          選擇收禮對象的條件，讓 AI 幫你想送什麼
        </p>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="年齡層" value={age} onChange={setAge} options={AGE_OPTIONS} />
          <Select label="地區" value={region} onChange={setRegion} options={REGION_OPTIONS} />
          <Select label="興趣" value={interest} onChange={setInterest} options={INTEREST_OPTIONS} />
          <Select label="預算" value={budget} onChange={setBudget} options={BUDGET_OPTIONS} />
          <Select label="送禮場合" value={occasion} onChange={setOccasion} options={OCCASION_OPTIONS} />
        </div>

        <button
          onClick={handleRecommend}
          disabled={loading || !isComplete}
          className="rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "推薦中…" : "🎁 幫我推薦禮物"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      {result && !loading && (
        <div
          key={result.summary}
          className="animate-pop-in flex w-full max-w-lg flex-col gap-5 rounded-2xl border-2 border-pink-400 bg-gradient-to-b from-pink-50 to-rose-50 p-8 shadow-xl dark:border-pink-700 dark:from-zinc-900 dark:to-zinc-900"
        >
          <p className="text-center text-base font-medium text-zinc-800 dark:text-zinc-200">
            {result.summary}
          </p>

          <div className="flex flex-col gap-3">
            {result.gifts.map((gift, i) => (
              <div
                key={gift.name + i}
                className="rounded-lg bg-white/80 p-4 shadow-sm dark:bg-zinc-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {gift.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                    {gift.priceRange}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {gift.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
