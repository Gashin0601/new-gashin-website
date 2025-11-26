import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ストーリー - 弱視というレンズを通して",
  description:
    "鈴木我信（Gashin Suzuki）の人生ストーリー。生まれつきの弱視という視覚障害を持ちながら、どのように世界を見て、どのような道を歩んできたのかを紹介します。",
  openGraph: {
    title: "ストーリー - 弱視というレンズを通して | 鈴木我信",
    description:
      "鈴木我信の人生ストーリー。生まれつきの弱視という視覚障害を持ちながら歩んできた道のり。",
    url: "https://gashinsuzuki.com/story",
    type: "article",
  },
  twitter: {
    title: "ストーリー - 弱視というレンズを通して | 鈴木我信",
    description:
      "鈴木我信の人生ストーリー。生まれつきの弱視という視覚障害を持ちながら歩んできた道のり。",
  },
  alternates: {
    canonical: "https://gashinsuzuki.com/story",
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
