import Link from "next/link";

interface Tool {
  name: string;
  tagline: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  accent: string;
}

const TOOLS: Tool[] = [
  {
    name: "抽獎轉盤",
    tagline: "團建、尾牙、班會都好用",
    description:
      "輸入名單，轉動轉盤，隨機抽出幸運兒。適合聚會抽獎、隨機分組、決定順序等各種場合。",
    href: "/lottery",
    icon: "🎡",
    gradient: "from-emerald-600 to-emerald-800",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "番茄鐘",
    tagline: "專注工作，高效休息",
    description:
      "經典番茄工作法計時器，搭配圓形進度環與可自訂的專注 / 休息時間，幫助你維持專注節奏。",
    href: "/pomodoro",
    icon: "🍅",
    gradient: "from-rose-600 to-red-800",
    accent: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "好運抽籤",
    tagline: "每天抽一支，看看今日運勢",
    description:
      "隨機抽出大吉、中吉到大凶的籤運，並附上愛情、事業、財運、健康四大面向的運勢提示。",
    href: "/fortune",
    icon: "🎋",
    gradient: "from-red-700 to-red-950",
    accent: "text-red-700 dark:text-red-400",
  },
  {
    name: "MBTI 性格分析",
    tagline: "AI 幫你分析十六型人格",
    description:
      "描述你的個性、行為模式或喜好，交給 AI 分析最符合的 MBTI 類型，並說明四大維度的判斷依據。",
    href: "/mbit",
    icon: "🧠",
    gradient: "from-indigo-600 to-purple-800",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "禮物推薦",
    tagline: "AI 幫你想送什麼禮物",
    description:
      "選擇收禮對象的年齡、地區、興趣、預算與場合，交給 AI 推薦幾個合適的禮物選項。",
    href: "/gift",
    icon: "🎁",
    gradient: "from-pink-500 to-rose-700",
    accent: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "動漫圖片生成",
    tagline: "文字描述秒變動漫插畫",
    description:
      "輸入一段畫面描述，交給 AI 生成一張動漫卡通風格的插畫圖片。",
    href: "/image",
    icon: "🎨",
    gradient: "from-cyan-500 to-blue-700",
    accent: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "QR Code 產生器",
    tagline: "網址秒變 QR code",
    description:
      "輸入網址，一鍵產生對應的 QR code，方便分享與掃描。",
    href: "/qrcode",
    icon: "📱",
    gradient: "from-teal-500 to-emerald-700",
    accent: "text-teal-600 dark:text-teal-400",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            🧰 阿吉小工具箱
          </span>
          <nav className="hidden gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-rose-400/30 blur-3xl" />
            <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center">
            <span className="rounded-full bg-zinc-900/5 px-4 py-1 text-xs font-medium tracking-wide text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
              日常實用小工具集合
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              阿吉小工具箱
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              抽獎、專注、求籤，三個輕巧好用的小工具，
              <br className="hidden sm:block" />
              解決你工作與生活中的小需求。
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`rounded-full bg-gradient-to-r ${tool.gradient} px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105`}
                >
                  {tool.icon} {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-24">
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            工具一覽
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className={`flex h-28 items-center justify-center bg-gradient-to-br ${tool.gradient} text-5xl`}
                >
                  {tool.icon}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {tool.name}
                  </h3>
                  <p className={`text-xs font-medium ${tool.accent}`}>
                    {tool.tagline}
                  </p>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tool.description}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold ${tool.accent}`}
                  >
                    立即使用
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} 阿吉小工具箱</span>
          <div className="flex gap-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                {tool.name}
              </Link>
            ))}
          </div>
          <span>Built with Next.js & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
