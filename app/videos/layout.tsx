import { Metadata } from "next";

export const metadata: Metadata = {
  title: "動画一覧 - すべての動画コンテンツ",
  description:
    "鈴木我信（Gashin Suzuki）の動画コンテンツ一覧。視覚障害をテーマにしたショート動画をYouTube、TikTok、Instagramで配信中。",
  openGraph: {
    title: "動画一覧 | 鈴木我信",
    description:
      "鈴木我信の動画コンテンツ一覧。視覚障害をテーマにしたショート動画をYouTube、TikTok、Instagramで配信中。",
    url: "https://gashinsuzuki.com/videos",
    type: "website",
  },
  twitter: {
    title: "動画一覧 | 鈴木我信",
    description:
      "鈴木我信の動画コンテンツ一覧。視覚障害をテーマにしたショート動画をYouTube、TikTok、Instagramで配信中。",
  },
  alternates: {
    canonical: "https://gashinsuzuki.com/videos",
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
