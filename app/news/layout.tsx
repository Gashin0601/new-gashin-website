import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース・メディア掲載",
  description:
    "鈴木我信のメディア掲載情報。日刊SPA!、J-CASTニュースなどのWebメディアで取り上げられた記事やインタビュー、ミテルンデスに関する報道を紹介。",
  keywords: [
    "鈴木我信",
    "メディア掲載",
    "ニュース",
    "インタビュー",
    "日刊SPA!",
    "J-CASTニュース",
    "視覚障害",
    "ミテルンデス",
  ],
  openGraph: {
    title: "ニュース・メディア掲載 | 鈴木我信",
    description:
      "鈴木我信のメディア掲載情報。各メディアでの取材記事やプロジェクト情報。",
    url: "https://gashin.me/news",
    type: "website",
  },
  twitter: {
    title: "ニュース・メディア掲載 | 鈴木我信",
    description:
      "鈴木我信のメディア掲載情報。各メディアでの取材記事やプロジェクト情報。",
  },
  alternates: {
    canonical: "https://gashin.me/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
