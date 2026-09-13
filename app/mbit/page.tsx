"use client";

import Link from "next/link";
import { useState } from "react";

interface Dimension {
  type: string;
  explanation: string;
}

interface MbtiResult {
  mbti: string;
  summary: string;
  dimensions: {
    EI: Dimension;
    SN: Dimension;
    TF: Dimension;
    JP: Dimension;
  };
}

const DIMENSION_LABELS: Record<keyof MbtiResult["dimensions"], string> = {
  EI: "外向 (E) / 內向 (I)",
  SN: "實感 (S) / 直覺 (N)",
  TF: "思考 (T) / 情感 (F)",
  JP: "判斷 (J) / 感知 (P)",
};

export default function MbitPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MbtiResult | null>(null);

  const handleAnalyze = async () => {
    if (loading || !description.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/mbit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "分析失敗，請稍後再試");
      }

      setResult(data as MbtiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失敗，請稍後再試");
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
          🧠 MBTI 性格分析
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          描述你的個性、行為模式或喜好，讓 AI 幫你分析 MBTI 類型
        </p>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例如：我喜歡獨處思考，做決定前會蒐集大量資料分析利弊，不太喜歡臨時的社交場合，但和熟悉的朋友在一起時很自在……"
          rows={6}
          className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "分析中…" : "✨ 開始分析"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      {result && !loading && (
        <div
          key={result.mbti}
          className="animate-pop-in flex w-full max-w-lg flex-col items-center gap-5 rounded-2xl border-2 border-indigo-400 bg-gradient-to-b from-indigo-50 to-purple-50 p-8 text-center shadow-xl dark:border-indigo-700 dark:from-zinc-900 dark:to-zinc-900"
        >
          <span className="text-5xl font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">
            {result.mbti}
          </span>
          <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            {result.summary}
          </p>

          <div className="grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {(Object.keys(result.dimensions) as (keyof MbtiResult["dimensions"])[]).map(
              (key) => (
                <div
                  key={key}
                  className="rounded-lg bg-white/80 p-3 shadow-sm dark:bg-zinc-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {DIMENSION_LABELS[key]}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {result.dimensions[key].type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {result.dimensions[key].explanation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
