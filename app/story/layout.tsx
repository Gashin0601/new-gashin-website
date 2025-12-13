import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ストーリー",
  description:
    "鈴木我信のストーリー。生まれつきの視覚障害（弱視）を持ちながら、どのように成長し、テクノロジーと出会い、今の活動に至ったのかを紹介。",
  keywords: [
    "鈴木我信",
    "ストーリー",
    "視覚障害",
    "弱視",
    "人生",
    "経歴",
    "慶應義塾大学",
    "環境情報学部",
  ],
  openGraph: {
    title: "ストーリー | 鈴木我信",
    description:
      "鈴木我信のストーリー。生まれつきの視覚障害を持ちながら、どのように成長し、今の活動に至ったのか。",
    url: "https://gashin.me/story",
    type: "article",
  },
  twitter: {
    title: "ストーリー | 鈴木我信",
    description:
      "鈴木我信のストーリー。生まれつきの視覚障害を持ちながら、どのように成長し、今の活動に至ったのか。",
  },
  alternates: {
    canonical: "https://gashin.me/story",
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
