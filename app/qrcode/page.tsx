"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrCodePage() {
  const [url, setUrl] = useState("");
  const [qrValue, setQrValue] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!url.trim()) return;
    setQrValue(url.trim());
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
          📱 QR Code 產生器
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          輸入網址，產生對應的 QR code
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />

        <button
          onClick={handleGenerate}
          disabled={!url.trim()}
          className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          📱 產生 QR Code
        </button>
      </div>

      {qrValue && (
        <div
          key={qrValue}
          className="animate-pop-in flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border-2 border-teal-400 bg-white p-8 shadow-xl dark:border-teal-700 dark:bg-zinc-900"
        >
          <QRCodeSVG value={qrValue} size={220} marginSize={2} />
          <p className="break-all text-center text-sm text-zinc-600 dark:text-zinc-400">
            {qrValue}
          </p>
        </div>
      )}
    </div>
  );
}
