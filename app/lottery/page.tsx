"use client";

import { useEffect, useRef, useState } from "react";

const SEGMENT_COLORS = ["#eafff2", "#0e6b45"];
const RING_WIDTH = 18;
const DOT_COUNT = 20;

const WHEEL_SIZE = 380;
const SPIN_DURATION_MS = 4500;
const MIN_SPINS = 5;

export default function LotteryPage() {
  const [namesInput, setNamesInput] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addNames = () => {
    const parsed = namesInput
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (parsed.length === 0) return;
    setNames((prev) => [...prev, ...parsed]);
    setNamesInput("");
  };

  const removeName = (index: number) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
    setWinner(null);
  };

  const clearAll = () => {
    setNames([]);
    setWinner(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = WHEEL_SIZE;
    const center = size / 2;
    const outerRadius = center - 4;
    const innerRadius = outerRadius - RING_WIDTH;

    ctx.clearRect(0, 0, size, size);

    // gold outer ring
    const ringGradient = ctx.createLinearGradient(0, 0, size, size);
    ringGradient.addColorStop(0, "#fde68a");
    ringGradient.addColorStop(0.5, "#f59e0b");
    ringGradient.addColorStop(1, "#fde68a");
    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = ringGradient;
    ctx.fill();

    // light dots on the ring
    const dotRadius = (outerRadius + innerRadius) / 2;
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (i / DOT_COUNT) * Math.PI * 2;
      const dx = center + dotRadius * Math.cos(angle);
      const dy = center + dotRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? "#fffbeb" : "#b45309";
      ctx.fill();
    }

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0e6b45";
      ctx.fill();
      ctx.fillStyle = "#eafff2";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("請先新增名單", center, center);
      return;
    }

    const segAngle = (Math.PI * 2) / names.length;

    names.forEach((name, i) => {
      const start = i * segAngle - Math.PI / 2;
      const end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, innerRadius, start, end);
      ctx.closePath();
      ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const isDark = i % 2 === 1;
      ctx.fillStyle = isDark ? "#eafff2" : "#0e6b45";
      ctx.font = "bold 14px sans-serif";
      const label = name.length > 8 ? name.slice(0, 7) + "…" : name;
      ctx.fillText(label, innerRadius - 14, 0);
      ctx.restore();
    });
  }, [names]);

  const spin = () => {
    if (spinning || names.length === 0) return;
    setWinner(null);
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * names.length);
    const segAngleDeg = 360 / names.length;
    const jitter = (Math.random() - 0.5) * segAngleDeg * 0.7;
    const winnerCenterDeg = (winnerIndex + 0.5) * segAngleDeg + jitter;
    const targetMod = (360 - winnerCenterDeg + 360) % 360;

    setRotation((prev) => {
      const currentMod = ((prev % 360) + 360) % 360;
      const delta = (targetMod - currentMod + 360) % 360;
      return prev + 360 * MIN_SPINS + delta;
    });

    setTimeout(() => {
      setSpinning(false);
      setWinner(names[winnerIndex]);
    }, SPIN_DURATION_MS);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-12 dark:bg-black">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        抽獎轉盤
      </h1>

      <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row">
        {/* Name management */}
        <div className="flex flex-1 flex-col gap-4 rounded-xl border-2 border-amber-300/60 bg-white p-6 shadow dark:bg-zinc-900">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            輸入名單（每行一個名字）
          </label>
          <textarea
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            rows={5}
            placeholder={"小明\n小華\n小美"}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <div className="flex gap-2">
            <button
              onClick={addNames}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              加入名單
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              清空
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              目前名單（{names.length}）
            </span>
            <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto">
              {names.map((name, i) => (
                <li
                  key={`${name}-${i}`}
                  className="flex items-center justify-between rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                      }}
                    />
                    {name}
                  </span>
                  <button
                    onClick={() => removeName(i)}
                    className="text-xs text-zinc-400 hover:text-red-500"
                  >
                    移除
                  </button>
                </li>
              ))}
              {names.length === 0 && (
                <li className="text-sm text-zinc-400">尚無名單</li>
              )}
            </ul>
          </div>
        </div>

        {/* Wheel */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border-4 border-amber-400 bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-950 p-8 shadow-2xl">
          <span className="pointer-events-none absolute left-4 top-4 text-2xl opacity-70 animate-float">
            🪙
          </span>
          <span className="pointer-events-none absolute right-6 top-10 text-xl opacity-60 animate-float-delay">
            🪙
          </span>
          <span className="pointer-events-none absolute bottom-8 left-8 text-xl opacity-60 animate-float">
            🪙
          </span>
          <span className="pointer-events-none absolute bottom-12 right-4 text-2xl opacity-70 animate-float-delay">
            🪙
          </span>

          <h2 className="text-2xl font-extrabold tracking-wide text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            🎉 幸運大轉盤 🎉
          </h2>

          <div
            className="relative"
            style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
          >
            {/* pointer */}
            <svg
              width="32"
              height="42"
              viewBox="0 0 24 32"
              className="absolute left-1/2 top-[-14px] z-30 -translate-x-1/2 drop-shadow-md"
            >
              <path
                d="M12 0C5 0 0 5 0 12c0 8 12 20 12 20s12-12 12-20C24 5 19 0 12 0z"
                fill="url(#pinGradient)"
                stroke="#b45309"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="pinGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            <canvas
              ref={canvasRef}
              width={WHEEL_SIZE}
              height={WHEEL_SIZE}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.2, 1)`
                  : "none",
              }}
            />

            <button
              onClick={spin}
              disabled={spinning || names.length === 0}
              className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-amber-300 to-amber-500 text-base font-bold leading-tight text-emerald-900 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {spinning ? (
                "抽獎中"
              ) : (
                <>
                  <span>開始</span>
                  <span>抽獎</span>
                </>
              )}
            </button>
          </div>

          {winner && !spinning && (
            <div className="rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-6 py-2 text-center text-xl font-bold text-emerald-900 shadow-lg">
              🎉 恭喜 {winner} 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
