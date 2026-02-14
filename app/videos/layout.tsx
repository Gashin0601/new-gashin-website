import { Metadata } from "next";
import videosData from "@/data/videos.json";

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

// SEO: Server-rendered content for crawlers
function VideosSeoContent() {
  return (
    <div className="sr-only">
      <p>鈴木我信（Suzuki Gashin）の動画作品一覧ページ。視覚障害（弱視）について発信するショート動画を、YouTube、TikTok、Instagramで公開しています。</p>
      <section>
        <h2>公開中の動画</h2>
        <p>現在{videosData.length}件の動画を公開中です。</p>
        <ul>
          {videosData.map((video) => (
            <li key={video.id}>
              <h3>{video.title}</h3>
              <p>YouTube、TikTok、Instagram、X（Twitter）で視聴できます。</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>配信プラットフォーム</h2>
        <ul>
          <li>YouTube: @gashin_lv</li>
          <li>TikTok: @gashin_lv</li>
          <li>Instagram: @suzuki_gashin</li>
          <li>X（Twitter）: @suzuki_gashin</li>
        </ul>
      </section>
    </div>
  );
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VideosSeoContent />
      {children}
    </>
  );
}
