import Hero from "@/components/sections/Hero";
import VideoAccount from "@/components/sections/VideoAccount";
import MediaSection from "@/components/sections/MediaSection";
import DailyAccount from "@/components/sections/DailyAccount";
import Contact from "@/components/sections/Contact";

// SEO: Server-rendered content for crawlers
function SeoContent() {
  return (
    <div className="sr-only" aria-hidden="true">
      <h1>鈴木我信｜Suzuki Gashin</h1>
      <p>我を信じて突き進む。</p>
      <article>
        <h2>プロフィール</h2>
        <p>慶應義塾大学 環境情報学部 1年。</p>
        <p>
          生まれつきの視覚障害（弱視）で、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動中。
        </p>
      </article>
      <article>
        <h2>活動内容</h2>
        <ul>
          <li>YouTube・TikTok・Instagramでの動画配信</li>
          <li>視覚障害者向けアプリ「ミテルンデス」の開発</li>
          <li>アクセシビリティに関する情報発信</li>
        </ul>
      </article>
      <article>
        <h2>SNSアカウント</h2>
        <ul>
          <li>YouTube: @gashin_lv</li>
          <li>TikTok: @gashin_lv</li>
          <li>X(Twitter): @suzuki_gashin</li>
          <li>Instagram: @suzuki_gashin</li>
        </ul>
      </article>
      <article>
        <h2>メディア掲載</h2>
        <p>日刊SPA!、J-CASTニュースなど多数のメディアに掲載。</p>
      </article>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* SEO: Hidden content for search engine crawlers */}
      <SeoContent />

      <Hero />
      <VideoAccount />
      <MediaSection />
      <DailyAccount />
      <Contact />

      {/* Footer Placeholder */}
      <footer className="py-8 text-center text-sm text-[var(--text-secondary)]">
        <p>
          &copy; {new Date().getFullYear()} Gashin Suzuki. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
