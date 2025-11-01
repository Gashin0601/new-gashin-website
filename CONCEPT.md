# 鈴木我信 ウェブサイト — プロジェクトコンセプト

最終更新：2025-11-01
ステータス：**コンセプト策定中**（実装前）

---

## 🎯 プロジェクトの目的

個人ブランド・実績・物語を「速く・読みやすく・アクセシブル」に発信する。
**最新のWeb技術** × **更新容易性** × **アクセシビリティ最優先**

---

## 🎬 オープニング演出

### ローディング画面（初回訪問時）
```
┌─────────────────────┐
│                     │
│    ◯ ← 白黒ロゴ     │
│   [━━━] ← ローディング │
│  SUZUKI GASHIN      │
│                     │
└─────────────────────┘
```

**演出フロー**
1. 鈴木我信の丸いミニマル白黒ロゴが表示
2. ロゴの周りの黒い枠がローディングアニメーション（円周進行）
3. "SUZUKI GASHIN"のテキスト
4. **約2秒で白黒からカラーへフェード**
5. メインページへ遷移

**技術的考慮**
- 初回のみ表示（sessionStorage使用）
- スキップボタン提供（A11y配慮）
- `prefers-reduced-motion`では即座にカラー表示

---

## 📐 サイト構成

### ページ構成
- **トップページ（`/`）** — 白テーマ
  - ヒーローセクション（写真・キャッチフレーズ・プロフィール）
  - メディア出演歴
  - 開発アプリ
  - YouTube投稿
  - SNSリンク

- **ストーリーページ（`/story`）** — 黒テーマ・シネマティック導入
  - **オープニング動画**：慶應SFCキャンパスを歩く鮮やかな映像
    - 5秒で徐々にグレースケールに
    - 目が閉じる演出とともに画面が真っ暗に
  - タイムライン年表UI（モバイル最適化）
    - 全7章構成：2006年誕生 → 2024年YouTube開始
    - 各章に動画・画像・本人録音ナレーション
  - PCではスマホ閲覧を促すQRコード表示
  - **詳細**: [`STORY_DRAFT.md`](./STORY_DRAFT.md) を参照

- **ニュース詳細（`/news/[slug]`）**
  - メディア掲載記事の詳細

### グローバルナビゲーション
- 全ページ右上にハンバーガーメニュー
- 各ページのテーマカラーに同期

---

## 🎨 デザインコンセプト

### テーマカラー
- **メインページ**：白ベース（`#ffffff` / `#0b0c10`）
- **ストーリー**：黒ベース（`#0b0c10` / `#ffffff`）
- **アクセント**：`#222284`（鈴木我信ブランドカラー）

### タイポグラフィ
- システムサンセリフ
- 本文は行間1.7の読みやすいスタイル
- コントラスト比：本文≥4.5:1、UI≥3:1

### アニメーション
- 200–300ms / ease-out
- `prefers-reduced-motion`を尊重（アクセシビリティ配慮）

---

## 🛠 技術スタック（案）

### フレームワーク・言語
- **Next.js**（App Router, RSC）+ TypeScript
- **Tailwind CSS v4**（`@tailwindcss/typography`）
- CSS Variables（ページごとテーマ切替）

### UI・コンポーネント
- Headless自作コンポーネント（`aria-*` 準拠）
- アイコン：Lucide
- 画像最適化：`next/image`（AVIF/WEBP）
- **音声ナレーションシステム**：
  - カスタム`<AudioNarration>`コンポーネント
  - Web Audio API（`HTMLAudioElement`）
  - 再生状態管理（Context API / Zustand）
  - 音声キュー管理（順次再生・スキップ）
  - ユーザー設定永続化（localStorage）
- **視覚体験シミュレーター**（第2章）：
  - Three.js / Photo Sphere Viewer（180度パノラマ）
  - Device Orientation API（ジャイロスコープ）
  - getUserMedia API（カメラアクセス、180度撮影）
  - Canvas API（視覚フィルター：左目盲・視野狭窄）
  - リアルタイム切り替え機能
- 動画：
  - **ホスト動画**：`<video>`タグ + Web API（`currentTime`, `ontimeupdate`）で精密制御
  - YouTube：**no-cookie** 埋め込み（遅延読み込み）
- 動画同期演出：
  - JavaScript `requestAnimationFrame`でフィルター効果とタイムラインを同期
  - CSS `filter`プロパティのスムーズな遷移
  - カスタムオーバーレイアニメーション（目が閉じる演出など）

### データ管理
- ローカルJSON（`news.json`, `socials.json`, `story.json`）
- 将来的にCMSへ移行可能な抽象化設計

### SEO・メタデータ
- Next.js `metadata` API
- JSON-LD構造化データ
- 動的OGP画像生成（`/api/og`）

### 解析・監視
- Vercel Analytics
- 将来的にPlausible追加検討

---

## 🎯 パフォーマンス目標

| 指標 | 目標値 |
|-----|--------|
| LCP (Largest Contentful Paint) | < 2.0s（4G/中端） |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200ms |
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| 初期JS | ≤ 50KB (gzip) |
| ローディング画面 | < 2.5s（スキップ可能） |
| ストーリー動画 | < 1MB（適切な圧縮）、プリロード |
| 音声ナレーション | < 100KB/ファイル（64kbps MP3推奨）、遅延読み込み |

---

## ♿️ アクセシビリティ要件

### 🎙️ 音声ナレーション（本人録音）
**コンセプト**：スクリーンリーダーユーザーに対して、通常の`alt`テキストやaria-labelではなく、**鈴木我信本人が録音した音声**を提供。

**適用範囲**
- ✅ すべての画像説明
- ✅ ボタン・リンクのラベル
- ✅ セクション見出し
- ✅ ストーリー年表の各章

**技術実装**
- スクリーンリーダー検出（`navigator.userAgent`または手動切替）
- 音声再生コントロール：
  - 自動再生・手動再生の選択
  - 一時停止・再生・スキップボタン
  - 再生速度調整（0.5x - 2.0x）
- フォールバック：音声読み込みエラー時は通常の`alt`/`aria-label`
- 視覚ユーザーには音声なし（オプションで有効化可能）

**音声ファイル構造**
```
/public/audio/
  ├─ narration/
  │   ├─ hero-intro.mp3           # ヒーロー自己紹介
  │   ├─ story-2006.mp3           # 2006年の章
  │   ├─ story-2023.mp3           # 2023年の章
  │   └─ ...
  ├─ buttons/
  │   ├─ see-story.mp3            # 「ストーリーを見る」ボタン
  │   ├─ skip-intro.mp3           # 「スキップ」ボタン
  │   └─ ...
  └─ images/
      ├─ portrait-main.mp3        # メインポートレート説明
      ├─ news-abema-prime.mp3     # ニュース画像説明
      └─ ...
```

### 必須項目
- ✅ フォーカスリング：2px以上、コントラスト≥3:1
- ✅ 全UIをキーボードで操作可能
- ✅ `prefers-reduced-motion`対応
  - ローディング画面：即座にカラー表示
  - ストーリー動画：静止画 + テキストで代替
  - すべてのアニメーションを無効化
- ✅ スクリーンリーダー順序と視覚順序の一致
- ✅ 動画には字幕提供（本人音声ナレーション付き）
- ✅ 自動再生動画：
  - 映像は音声なし（`muted`）
  - スキップボタン必須
  - 一時停止ボタン提供
- ✅ 音声ナレーション：
  - すべての音声にテキスト代替（`alt`/`aria-label`フォールバック）
  - 音声コントロール（再生・停止・速度調整）
  - ユーザー設定で音声ON/OFF

### ハンバーガーメニュー仕様
- `role="dialog"`
- フォーカストラップ
- `Esc`キーで閉じる
- バックドロップクリックで閉じる
- スクロールロック

---

## 📊 コンテンツ構造

### 1. ヒーローセクション
```
┌─────────────────────────────┐
│   [大きなポートレート写真]    │
│                              │
│  我を信じて、世界をほどく。  │
│                              │
│  慶應SFCの学生。視覚とテク   │
│  ノロジーで、学びと社会の垣  │
│  根をゆるめる実験をしています│
│                              │
│   [ストーリーを見る →]       │
└─────────────────────────────┘
```

### 2. ニュースセクション（統一レイアウト）
```
┌──────────────────────────────────────┐
│ [OGP画像] タイトル                    │
│  左固定   媒体名・日付                │
│          要約テキスト...              │
└──────────────────────────────────────┘
```
※ 左右交互ではなく、統一配置で一覧性を重視

**画像取得方法**:
- OGP画像自動取得：記事URLから`og:image`を取得
- 手動設定画像：任意の画像パスを指定
- フォールバック：取得失敗時はデフォルト画像

**詳細ページ機能**:
- 記事サマリー・媒体・公開日
- 外部リンク（`rel="noopener nofollow"`）
- X（Twitter）埋め込み（該当記事）
- 補足情報（旧ハンドルネームの説明など）

### 3. ストーリーページ「大根型」タイムライン

> **詳細な章構成**: [`STORY_DRAFT.md`](./STORY_DRAFT.md) を参照

**オープニング動画演出**
```
[鮮やかなSFCキャンパス]
      ↓ (0-5秒)
[徐々にグレースケール化]
      ↓ (5秒)
  [目が閉じる]
      ↓
  [真っ暗な画面]
      ↓
  [年表開始]
```

**年表構造**（全7章：2006年誕生 → 2024年YouTube開始）
```
        │
      ┌─┴─┐
      │2006│ ← 横浜で生まれる（全幅）
      └───┘
        │
      ┌─┴─┐
      │    │ ← 工作と探究心（左カード）
      └───┘
        │
      ┌─┴─┐
      │2018│ ← 国立盲学校（全幅）
      └───┘
        │
      ┌─┴─┐
      │2021│ ← 高校の活動（右カード）
      └───┘
        │
      ┌─┴─┐
      │2023│ ← 慶應SFC入学（左カード）
      └───┘
        │
      ┌─┴─┐
      │2024│ ← ローソン／YouTube（右・全幅）
      └───┘
```

**技術仕様**
- オープニング動画とスクロール位置の同期
- 動画の再生時間とフィルター効果をコードで制御
  - 0-5秒：`filter: grayscale(0%)` → `grayscale(100%)`
  - 5秒：オーバーレイで「目が閉じる」アニメーション
  - フェードアウト後、年表へ自動スクロール
- 中央に太い縦軸（sticky配置）
- 各章カード：IntersectionObserverでフェード/スライド演出
- 本人録音ナレーションの自動/手動再生
- スキップボタン提供（すぐに年表へジャンプ）

---

## 📁 データスキーマ（案）

### news.json
```json
[
  {
    "slug": "2025-nikkan-spa",
    "title": "日刊SPA!に取材していただきました",
    "summary": "障害があるが故の悩み、そして私の人生について語りました。",
    "source": "日刊SPA!",
    "date": "2025-XX-XX",
    "externalUrl": "https://nikkan-spa.jp/2117360/3",
    "ogpImageFetch": true,
    "image": null,
    "imageAlt": "日刊SPA!の記事",
    "audioNarration": "/audio/images/news-nikkan-spa.mp3"
  },
  {
    "slug": "2025-07-jcast-lawson",
    "title": "ローソンでの撮影禁止についてXの発信が話題に",
    "summary": "2025年8月、Xにてローソンで撮影することが難しいという投稿が話題となり、8600いいね以上となり、ネットニュースになりました。記事内で掲載されている「シュライン」はXのハンドルネームです。現在は、鈴木我信および@Suzuki_Gashinとなっています。",
    "source": "J-CASTニュース",
    "date": "2025-07-19",
    "externalUrl": "https://www.j-cast.com/2025/07/19506092.html?p=all",
    "ogpImageFetch": true,
    "image": null,
    "imageAlt": "J-CASTニュースの記事",
    "audioNarration": "/audio/images/news-jcast-lawson.mp3",
    "embedTweet": {
      "url": "https://x.com/suzuki_gashin/status/1945395481015898261?s=61",
      "tweetId": "1945395481015898261"
    },
    "notes": "記事内の「シュライン」は旧ハンドルネーム。現在は「鈴木我信」(@Suzuki_Gashin)"
  }
]
```

**OGP画像の自動取得**:
- `ogpImageFetch: true` の場合、`externalUrl` から OGP 画像を自動取得
- サーバーサイドで fetch して `og:image` メタタグを解析
- 取得した画像を Next.js Image Optimizer 経由で配信
- フォールバック：取得失敗時はデフォルト画像またはテキストのみ表示

**実装例**:
```typescript
// /app/api/ogp/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('URL required', { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // OGP画像を抽出
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const ogImage = ogImageMatch ? ogImageMatch[1] : null;

    return Response.json({ ogImage });
  } catch (error) {
    return Response.json({ ogImage: null, error: 'Failed to fetch OGP' }, { status: 500 });
  }
}
```

**X埋め込み**:
```typescript
// react-tweet または @twitterdev/twitter-tweet-embed を使用
import { Tweet } from 'react-tweet';

<Tweet id={embedTweet.tweetId} />
```

### socials.json
```json
{
  "youtube": "https://youtube.com/@gashin",
  "tiktok": "https://www.tiktok.com/@gashin",
  "x": "https://x.com/gashin_lv",
  "instagram": "https://instagram.com/gashin",
  "threads": "https://www.threads.net/@gashin_lv",
  "bluesky": "https://bsky.app/profile/gashin.example"
}
```

### story.json

> **詳細な章構成とナレーション内容**: [`STORY_DRAFT.md`](./STORY_DRAFT.md) を参照

```json
{
  "opening": {
    "videoSrc": "/videos/story-opening-sfc.mp4",
    "duration": 5,
    "effects": [
      {
        "time": 0,
        "filter": "grayscale(0%)",
        "description": "鮮やかなSFCキャンパス"
      },
      {
        "time": 5,
        "filter": "grayscale(100%)",
        "description": "徐々にグレースケール化"
      },
      {
        "time": 5.5,
        "overlay": "eye-closing",
        "description": "目が閉じる演出"
      },
      {
        "time": 6,
        "fadeOut": true,
        "description": "真っ暗な画面へ"
      }
    ]
  },
  "timeline": [
    {
      "year": 2006,
      "title": "横浜で生まれる",
      "layout": "full",
      "body": "全盲と診断。家族と共に育つ日々の始まり。",
      "audioNarration": "/audio/narration/story-2006.mp3",
      "media": [
        {
          "type": "image",
          "src": "/images/story/2006-baby.jpg",
          "alt": "幼少期の写真",
          "audioDescription": "/audio/images/story-2006-baby.mp3"
        }
      ],
      "accent": "#222284"
    },
    {
      "year": 2023,
      "title": "慶應SFC 入学",
      "layout": "left",
      "body": "テクノロジーと社会デザインに没頭。",
      "audioNarration": "/audio/narration/story-2023.mp3",
      "media": [
        {
          "type": "image",
          "src": "/images/story/2023-sfc.jpg",
          "alt": "SFCキャンパス",
          "audioDescription": "/audio/images/story-2023-sfc.mp3"
        }
      ]
    }
  ]
}
```

---

## 🚀 デプロイ・運用

### プラットフォーム
- **Vercel** Production（`main`ブランチ）
- **Vercel** Preview（プルリクエスト）

### 更新フロー
1. JSONファイルを編集（`news.json`, `socials.json`, `story.json`）
2. 画像を`/public/images/`に配置
3. 音声ナレーションを録音し、`/public/audio/`に配置
4. JSONファイルに音声パスを追加
5. gitコミット & プッシュ
6. 自動デプロイ

### ドメイン
- 例：`gashin.jp`（apex + www）

---

## 🔐 セキュリティ・プライバシー

### CSP（推奨設定）
```
default-src 'self';
img-src 'self' data: https:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube-nocookie.com;
style-src 'self' 'unsafe-inline';
frame-src https://www.youtube-nocookie.com;
connect-src 'self' https://vitals.vercel-insights.com;
```

### ヘッダー
- `X-Frame-Options: SAMEORIGIN`
- 外部リンクは`rel="noopener nofollow"`

---

## ✅ MVP完了条件

- [ ] ローディング画面（白黒→カラー、2秒、スキップ可能）
- [ ] `/`、`/story`、`/news/[slug]`が仕様通り動作
- [ ] ストーリーオープニング動画演出（カラー→グレー→目が閉じる→暗転）
- [ ] 全7章のストーリー実装（2006年誕生 → 2024年YouTube開始）
- [ ] 動画とコードの精密な同期（filter効果、タイムライン制御）
- [ ] **音声ナレーションシステム完全実装**
  - [ ] すべての画像・ボタン・セクションに本人録音音声（18ファイル）
  - [ ] 音声コントロール（再生・停止・速度調整）
  - [ ] スクリーンリーダー検出または手動切替
  - [ ] フォールバック機能（テキストalt）
- [ ] **視覚体験シミュレーター実装**（第2章）
  - [ ] 180度パノラマビューワー
  - [ ] カメラ撮影機能（180度）またはサンプル画像
  - [ ] 視覚フィルター（左目盲・視野狭窄）
  - [ ] リアルタイム切り替えボタン
  - [ ] ジャイロスコープ対応
- [ ] ハンバーガーメニューのA11y完全対応
- [ ] `prefers-reduced-motion`完全対応（静止画代替）
- [ ] OGP、JSON-LD、sitemap、robots.txt実装
- [ ] Lighthouse基準達成（Performance 95+, A11y 100）
- [ ] JSONファイル編集のみで更新可能（音声パス含む）
- [ ] レスポンシブ対応（320px〜）

---

## 📝 プレースホルダー文面

### キャッチフレーズ
> 我を信じて、世界をほどく。

### 自己紹介
> 慶應SFCの学生。視覚とテクノロジーで、学びと社会の垣根をゆるめる実験をしています。動画と文章で日々を記録。

### 章タイトル例
- はじまりの白
- SFCという森
- 見えない地図の描き方

---

## 🎓 次のステップ

1. **技術選定の最終確認**
   - Next.js 15 + Tailwind v4 でOK？
   - その他のライブラリ・ツール

2. **デザインモックアップ**
   - Figmaでワイヤーフレーム作成？
   - それとも直接実装？

3. **コンテンツ準備**
   - ロゴデザイン（丸いミニマル白黒ロゴ）
   - ストーリーオープニング動画（SFCキャンパス歩行、5秒）
   - 「目が閉じる」アニメーション素材
   - **音声ナレーション録音**：
     - すべての画像説明（各セクション）
     - ボタン・リンクのラベル音声
     - ストーリー年表の各章ナレーション（全7章）
     - ヒーロー自己紹介
     - 視覚体験シミュレーター用音声ガイド
     - 📋 **録音リスト**: [`STORY_DRAFT.md`](./STORY_DRAFT.md#音声ファイル録音リスト) を参照（18ファイル）
   - 音声ファイル編集・最適化（MP3、適切なビットレート）
   - 使用する写真・動画の選定
     - 📋 **撮影リスト**: [`STORY_DRAFT.md`](./STORY_DRAFT.md#動画撮影リスト) を参照（6動画）
   - **視覚体験シミュレーター用素材**：
     - サンプルパノラマ画像（180度、2048x1024px、Equirectangular形式）
     - 📋 **素材リスト**: [`STORY_DRAFT.md`](./STORY_DRAFT.md#パノラマ画像素材リスト) を参照
   - ニュース記事データの整理
   - ストーリー年表の執筆（完了：[`STORY_DRAFT.md`](./STORY_DRAFT.md) 参照）

4. **実装開始**
   - プロジェクト初期化
   - コンポーネント設計
   - データ構造実装

---

## 📚 参考リンク

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
