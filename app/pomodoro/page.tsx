"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "work" | "shortBreak" | "longBreak";

const MODE_LABEL: Record<Mode, string> = {
  work: "專注",
  shortBreak: "短休息",
  longBreak: "長休息",
};

const MODE_COLOR: Record<Mode, string> = {
  work: "#ef4444",
  shortBreak: "#22c55e",
  longBreak: "#3b82f6",
};

const DEFAULT_MINUTES: Record<Mode, number> = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

const LONG_BREAK_INTERVAL = 4;
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function playBeep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
  } catch {
    // ignore if audio isn't available
  }
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPage() {
  const [durations, setDurations] = useState<Record<Mode, number>>(
    DEFAULT_MINUTES
  );
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(
    DEFAULT_MINUTES.work * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [completedWork, setCompletedWork] = useState(0);
  const [autoStart, setAutoStart] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchMode = (nextMode: Mode, keepRunning: boolean) => {
    setMode(nextMode);
    setSecondsLeft(durations[nextMode] * 60);
    setIsRunning(keepRunning);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return;

    playBeep();

    if (mode === "work") {
      const nextCompleted = completedWork + 1;
      setCompletedWork(nextCompleted);
      const nextMode: Mode =
        nextCompleted % LONG_BREAK_INTERVAL === 0 ? "longBreak" : "shortBreak";
      switchMode(nextMode, autoStart);
    } else {
      switchMode("work", autoStart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isRunning]);

  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} - ${MODE_LABEL[mode]} | 番茄鐘`;
  }, [secondsLeft, mode]);

  const totalSeconds = durations[mode] * 60;
  const progress = totalSeconds === 0 ? 0 : (totalSeconds - secondsLeft) / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const color = MODE_COLOR[mode];

  const handleStartPause = () => {
    if (secondsLeft === 0) return;
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  const handleDurationChange = (key: Mode, value: number) => {
    const clamped = Math.max(1, Math.min(180, value));
    setDurations((prev) => {
      const next = { ...prev, [key]: clamped };
      if (key === mode && !isRunning) {
        setSecondsLeft(clamped * 60);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-12 dark:bg-black">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        番茄鐘
      </h1>

      <div className="flex w-full max-w-3xl flex-col gap-8 md:flex-row">
        {/* Timer */}
        <div className="flex flex-1 flex-col items-center gap-6 rounded-xl bg-white p-8 shadow dark:bg-zinc-900">
          <div className="flex gap-2 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
            {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m, false)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === m
                    ? "text-white"
                    : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
                style={mode === m ? { backgroundColor: color } : undefined}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>

          <div className="relative flex items-center justify-center">
            <svg width={260} height={260} className="-rotate-90">
              <circle
                cx={130}
                cy={130}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={14}
                className="text-zinc-100 dark:text-zinc-800"
              />
              <circle
                cx={130}
                cy={130}
                r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatTime(secondsLeft)}
              </span>
              <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {MODE_LABEL[mode]}中
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartPause}
              className="rounded-full px-8 py-3 text-lg font-semibold text-white shadow transition-colors"
              style={{ backgroundColor: color }}
            >
              {isRunning ? "暫停" : secondsLeft === 0 ? "已結束" : "開始"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-full border border-zinc-300 px-6 py-3 text-lg font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              重置
            </button>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            今日已完成 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{completedWork}</span> 個番茄鐘
          </p>
        </div>

        {/* Settings */}
        <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-900 md:w-64">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            時間設定（分鐘）
          </h2>
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <label key={m} className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                {MODE_LABEL[m]}
              </span>
              <input
                type="number"
                min={1}
                max={180}
                value={durations[m]}
                onChange={(e) =>
                  handleDurationChange(m, Number(e.target.value))
                }
                className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </label>
          ))}

          <label className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300"
            />
            結束後自動開始下一階段
          </label>
        </div>
      </div>
    </div>
  );
}
