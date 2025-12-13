import { Metadata } from "next";

export const metadata: Metadata = {
  title: "動画一覧",
  description:
    "鈴木我信の動画作品一覧。YouTube、TikTok、Instagramで公開している視覚障害やアクセシビリティに関する動画コンテンツをまとめて紹介。",
  keywords: [
    "鈴木我信",
    "動画",
    "YouTube",
    "TikTok",
    "Instagram",
    "視覚障害",
    "弱視",
    "ショート動画",
    "コンテンツクリエイター",
  ],
  openGraph: {
    title: "動画一覧 | 鈴木我信",
    description:
      "鈴木我信の動画作品一覧。YouTube、TikTok、Instagramで公開している動画コンテンツをまとめて紹介。",
    url: "https://gashin.me/videos",
    type: "website",
  },
  twitter: {
    title: "動画一覧 | 鈴木我信",
    description:
      "鈴木我信の動画作品一覧。YouTube、TikTok、Instagramで公開している動画コンテンツをまとめて紹介。",
  },
  alternates: {
    canonical: "https://gashin.me/videos",
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
