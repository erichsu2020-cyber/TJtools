"use client";

import Link from "next/link";
import { useState } from "react";

export default function ImagePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (loading || !description.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "圖片生成失敗，請稍後再試");
      }

      setImage(data.image as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "圖片生成失敗，請稍後再試");
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
          🎨 動漫圖片生成
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          描述一段畫面，AI 幫你畫成動漫卡通風格的插畫
        </p>
      </div>

      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例如：一位穿著水手服的女孩，站在櫻花樹下，背景是夕陽下的校園……"
          rows={5}
          className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-800 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "生成中…（約需 10-20 秒）" : "🎨 開始生成"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex w-full max-w-lg animate-pulse items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-16 text-cyan-500 dark:border-cyan-800 dark:bg-zinc-900">
          畫圖中，請稍候…
        </div>
      )}

      {image && !loading && (
        <div className="animate-pop-in flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border-2 border-cyan-400 bg-white p-4 shadow-xl dark:border-cyan-700 dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="AI 生成的動漫風格插畫"
            className="w-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
