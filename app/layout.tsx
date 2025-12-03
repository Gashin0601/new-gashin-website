import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SkipLink from "@/components/ui/SkipLink";
import JsonLd from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/hooks/useTheme";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = "https://gashinsuzuki.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "鈴木我信 | Gashin Suzuki - 視覚とテクノロジーの実験者",
    template: "%s | 鈴木我信",
  },
  description:
    "慶應義塾大学SFCの学生・鈴木我信の公式サイト。視覚障害をもちながら、テクノロジーで学びと社会の垣根をゆるめる実験をしています。動画クリエイター、アプリ開発者として活動中。",
  keywords: [
    "鈴木我信",
    "Gashin Suzuki",
    "慶應義塾大学",
    "SFC",
    "視覚障害",
    "弱視",
    "テクノロジー",
    "アクセシビリティ",
    "動画クリエイター",
    "YouTuber",
    "TikToker",
    "ミテルンデス",
    "Miterundesu",
  ],
  authors: [{ name: "鈴木我信", url: baseUrl }],
  creator: "鈴木我信",
  publisher: "鈴木我信",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: baseUrl,
    siteName: "鈴木我信 | Gashin Suzuki",
    title: "鈴木我信 | Gashin Suzuki - 視覚とテクノロジーの実験者",
    description:
      "慶應義塾大学SFCの学生・鈴木我信の公式サイト。視覚障害をもちながら、テクノロジーで学びと社会の垣根をゆるめる実験をしています。",
    images: [
      {
        url: "/images/og/og-image-large.png",
        width: 1200,
        height: 1200,
        alt: "鈴木我信 - Suzuki Gashin",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@suzuki_gashin",
    creator: "@suzuki_gashin",
    title: "鈴木我信 | Gashin Suzuki - 視覚とテクノロジーの実験者",
    description:
      "慶應義塾大学SFCの学生・鈴木我信の公式サイト。視覚障害をもちながら、テクノロジーで学びと社会の垣根をゆるめる実験をしています。",
    images: ["/images/og/og-image-large.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "personal website",
  verification: {
    // Google Search Console verification (add your verification code when you have it)
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SkipLink />
          <div className="bg-noise" aria-hidden="true" />
          <LoadingScreen />
          <Header />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
