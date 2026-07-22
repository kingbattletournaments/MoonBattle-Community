/**
 * Public website branding & download links.
 *
 * Change only `APP_NAME` below — every `{appName}` placeholder
 * in this file is filled in automatically.
 */

const APP_NAME = "MoonBattle";

const brandSource = {
  appName: APP_NAME,
  editionLabel: "Community",

  tagline: "Play Tournaments. Win Real Coins.",

  hero: {
    typedPhrases: ["Play Tournaments", "Win Real Coins", "Join Daily Grinds"],
    subtitle:
      "{appName} is a secure tournament platform built for fair, skill-based tournaments. Download the app and start winning today.",
  },

  /** Image paths — files in Website/public/ */
  images: {
    welcomeScreen: "/images/welcome-screen.jpg",
    appLogo: "/images/app-logo.jpg",
    coin: "/images/coin.png",
  },

  /**
   * Landing page app screenshots (1080×2256 avg — aspect ratio 45:94).
   * Files: public/images/app-screenshots/
   */
  appScreenshots: {
    aspectRatio: "45 / 94",
    width: 1080,
    height: 2256,
    items: [
      { src: "/images/app-screenshots/app-ss-for-website-1.jpg", alt: "{appName} home screen" },
      { src: "/images/app-screenshots/app-ss-for-website-2.jpg", alt: "{appName} tournaments screen" },
      { src: "/images/app-screenshots/app-ss-for-website-3.jpg", alt: "{appName} account screen" },
    ],
  },

  download: {
    apkUrl: process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL ?? "",
    buttonLabel: "Download Now !!",
  },

  features: [
    {
      title: "Daily Tournaments",
      description: "Solo, duo, and squad matches with live schedules and instant room details.",
      icon: "🏆",
    },
    {
      title: "Real Coin Rewards",
      description: "Win prize pools, per-kill bonuses, and rank rewards you can withdraw.",
      icon: "💰",
    },
    {
      title: "Fair & Secure",
      description: "Verified entries, transparent results, and admin-managed payouts.",
      icon: "🛡️",
    },
  ],

  howToPlay: {
    title: "How To Play",
    subtitle: "Begin your game now",
    steps: [
      { title: "Download App", description: "Install {appName} and create your account." },
      { title: "Add Coins", description: "Deposit via UPI and join your favourite tournament." },
      { title: "Play & Win", description: "Enter the room, compete, and claim your rewards." },
    ],
  },

  prizes: {
    title: "Money Prizes",
    description:
      "Once you win your first tournament, request a withdrawal from your {appName} wallet. Keep playing to win bigger prizes. Payouts are sent via UPI or Google Play redeem codes.",
    methods: [
      { name: "UPI", logo: "/images/payments/upi.png" },
      { name: "Google Play Redeem Code", logo: "/images/payments/google-play.png" },
    ],
  },

  footer: {
    /** Organizer copyright line only — MoonStack platform badge is fixed in src/lib/platform-ref.ts */
    copyright: "{appName}. All rights reserved.",
  },

  meta: {
    title: "{appName} — Tournament App",
    description:
      "Download {appName} — daily tournaments, real coin prizes, leaderboards, and instant withdrawals.",
  },

  colors: {
    dark: "#363636",
    accent: "#0099ff",
    accentHover: "#007acc",
    accentAlt: "#f07873",
  },
} as const;

type BrandSource = typeof brandSource;

function resolveBrandTokens(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(/\{appName\}/g, APP_NAME)
      .replace(/\{tagline\}/g, brandSource.tagline);
  }
  if (Array.isArray(value)) {
    return value.map(resolveBrandTokens);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, resolveBrandTokens(nested)]),
    );
  }
  return value;
}

/** Fully resolved brand config — all `{appName}` / `{tagline}` tokens are already filled. */
export const brand = resolveBrandTokens(brandSource) as BrandSource;

export type BrandConfig = typeof brand;

/** Resolve leftover tokens in any string (e.g. meta title/description). */
export function resolveMeta(str: string): string {
  return str
    .replace(/\{appName\}/g, brand.appName)
    .replace(/\{tagline\}/g, brand.tagline);
}
